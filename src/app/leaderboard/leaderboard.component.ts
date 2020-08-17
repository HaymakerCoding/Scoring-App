import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { GroupService } from '../services/group.service';
import { DivisionService } from '../services/division.service';
import { Subscription } from 'rxjs';
import { GroupParticipant } from '../models/GroupParticipant';
import { EventService } from '../services/event.service';

/**
 * Show a leaderboard view of all players.
 * Filtered by user's division
 * Display accumulative data for every event in the tournament
 * As players progress their holes completed are addd together as well as their scores per event
 * 
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  
  @Input() scorecard: Scorecard;
  @Input() event: Event;
  @Input() eventTypeId: number;
  @Input() events: Event[];

  usersDivision: any;
  loadingPercent: number;
  subscriptions: Subscription[] = [];
  groups: Group[];
  groupsFetched = 0;
  scorecardsFetched = 0;
  displayParticipants: GroupParticipant[];

  constructor(
    private groupService: GroupService,
    private divisionService: DivisionService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.displayParticipants = [];
    this.events.forEach(x => {
      x.groups = null;
      x.divisionParticipants = [];
    });
    this.usersDivision = this.divisionService.getUsersDivision();
    this.events.forEach(event => {this.getAllGroups(event)});
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent = percent;
  }

  getAllGroups(event: Event) {
    this.subscriptions.push(this.groupService.getAll(event.id.toString(), this.eventTypeId.toString()).subscribe(response => {
      if (response.status === 200) {
        event.groups = response.payload;
        this.groupsFetched++;
        if (this.groupsFetched === this.events.length) {
          this.setLoadingPercent(40);
          this.getScorecards();
        }
      } else {
        console.error(response);
      }
    }));
  }

  getScorecards() {
    this.events.forEach(event => {
      this.getScorecard(event);
    });
  }

  /**
   * Get the scorecard for the event
   */
  getScorecard(event: Event) {
    this.subscriptions.push(this.eventService.getScorecard(event.scorecardId.toString()).subscribe(response => {
      if (response.status === 200) {
        event.scorecard = response.payload;
        this.scorecardsFetched++;
        if (this.scorecardsFetched === this.events.length) {
          this.setLoadingPercent(60);
          this.events.forEach(event => {
            this.filterGroupsByDivision(event);
          });
          this.setupDisplayParticipants();
          this.setLoadingPercent(100);
        }
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Filter out a list of display participants by division of the current logged in user
   * @param event Golf Event
   */
  filterGroupsByDivision(event: Event) {
    if (!event.divisionParticipants) {
      event.divisionParticipants = [];
    }
    event.groups.forEach(group => {
      group.groupParticipants.forEach(participant => {
        participant.divisions.forEach(division => {
          if (+division.id === +this.usersDivision.id) {
            participant.score = this.getScore(participant, event.scorecard);
            event.divisionParticipants.push(participant);
          }
        });
      });
    });
  }

  setupDisplayParticipants() {
    this.displayParticipants = this.events[0].divisionParticipants;
    this.displayParticipants.forEach(participant => {
      participant.totalScore = this.getTotalScore(participant);
      //participant.totalScore = this.getEventScore(participant, this.events[1]);
    });
    this.sortScores();
  }

  sortScores() {
    if (this.displayParticipants) {
      this.displayParticipants.sort((a, b) => {
        return a.totalScore - b.totalScore;
      });
    }
  }

  /**
   * Get the max hole completed by a participant
   */
  getHoleComplete(participant: GroupParticipant): number {
    let max = 0;
    const holeScores = participant.holeScores;
    if (holeScores) {
      participant.holeScores.forEach(holeScore => {
        if (+holeScore.hole && holeScore.score && holeScore.id) {
          max++;
        }
      });
    }
    return max;
  }

  /**
   * Return the participants current score.
   * Compare their hole scores total to toal pars.
   * @param participant Grooup Participant
   * @param maxHoleComplete The Max hole the participant has played up to
   */
  getScore(participant: GroupParticipant, scorecard: Scorecard): number {
    let targetPar = 0;
    let usersScore = 0;
    scorecard.scorecardHoles.forEach(hole => {
      const holeScore = participant.holeScores.find(holeScore => +holeScore.hole === +hole.no);
        if (holeScore && holeScore.score) {
          usersScore += +holeScore.score;
          targetPar += +hole.par;
        }
    });
    return usersScore - targetPar;
  }

  /**
   * Get the user's TOTAL score across all events
   */
  getTotalScore(participant: GroupParticipant) {
    let totalScore = 0;
    this.events.forEach(event => {
      if (event.divisionParticipants) {
        const participantFound: GroupParticipant = event.divisionParticipants.find(x => +x.memberId === +participant.memberId);
        if (participantFound && participantFound.score) {
          totalScore += +participantFound.score;
        }
      }
    });
    return totalScore;
  }

  /**
   * Get the max hole completed by a participant
   */
  getTotalHolesComplete(participant: GroupParticipant): number {
    let total = 0;
    this.events.forEach(event => {
      if (event.divisionParticipants) {
        const participantFound: GroupParticipant = event.divisionParticipants.find(x => +x.memberId === +participant.memberId);
        if (participantFound && participantFound.holeScores) {
          participantFound.holeScores.forEach(holeScore => {
            if (+holeScore.id) {
              total ++;
            }
          });
        }
      }
    });
    return total;
  }

  getEventScore(participant: GroupParticipant, event: Event): number {
    let found: GroupParticipant;
    event.groups.forEach(group => {
      group.groupParticipants.forEach(p => {
        if (p.memberId === participant.memberId) {
          found = p;
        }
      });
    });
    if (found) {
      return this.getScore(found, event.scorecard);
    } else {
      return null;
    }
  }
  

}
