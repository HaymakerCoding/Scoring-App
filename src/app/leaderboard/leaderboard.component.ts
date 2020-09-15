import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { DivisionService } from '../services/division.service';
import { Subscription } from 'rxjs';
import { EventService } from '../services/event.service';
import { ScoringType } from '../main/main.component';
import { EventDivision } from '../models/EventDivision';
import { Team } from '../models/Team';
import { Individual } from '../models/Individual';
import { EventParticipant } from '../models/EventParticipant';

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
  events: Event[];

  usersDivision: EventDivision;
  loadingPercent: number;
  subscriptions: Subscription[] = [];
  scorecardsFetched = 0;
  indivduals: Individual[];
  teams: Team[]
  @Input() scoringType: ScoringType;

  constructor(
    private divisionService: DivisionService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.getUserDivision();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent = percent;
  }

  getUserDivision() {
    this.subscriptions.push(this.divisionService.getUsersDivisionFromServer(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.usersDivision = response.payload;
        console.log(this.usersDivision);
        this.setLoadingPercent(30);
        this.getEventParticipants();
      } else {
        console.error(response);
      }
    }));
  }

  getEventParticipants() {
    this.subscriptions.push(this.eventService.getParticipantsByDivision(this.event.id.toString(), this.usersDivision.competitionId.toString(), this.scoringType).subscribe(response => {
      if (response.status === 200) {
        if (this.scoringType === ScoringType.TEAM) {
          this.teams = response.payload;
          console.log(this.teams);
        } else {
          this.indivduals = response.payload;
        }
        this.setLoadingPercent(80);
        this.setScores();
      } else {
        console.error(response);
      }
    }));
  }

  getParticipants() {
    return this.scoringType === ScoringType.TEAM ? this.teams : this.indivduals;
  }

  getParticipantNames(participant) {
    return this.scoringType === ScoringType.TEAM ? participant.teamMembers[0].fullName + ' & ' + participant.teamMembers[1].fullName : participant.fullName;
  }

  getTotalHolesComplete(participant): number {
    let total: number = 0;
    participant.holeScores.forEach(holeScore => {
      if (+holeScore.id) {
        total++;
      }
    });
    return total;
  }

  setScores() {
    if (this.scoringType === ScoringType.TEAM) {
      this.teams.forEach( team => {
        team.score = this.getScore(team, this.getTotalHolesComplete(team), this.scorecard);
      });
      this.sortScores(this.teams);
    } else {
      this.indivduals.forEach( x => {
        x.score = this.getScore(x, this.getTotalHolesComplete(x), this.scorecard);
      });
      this.sortScores(this.indivduals);
    }
    
    this.setLoadingPercent(100);
  }

  /**
   * Return the participants current score.
   * Compare their hole scores total to toal pars.
   * @param participant Grooup Participant
   * @param maxHoleComplete The Max hole the participant has played up to
   */
  getScore(participant: EventParticipant, maxHoleComplete: number, scorecard: Scorecard): number {
    let targetPar = 0;
    let usersScore = 0;
    scorecard.scorecardHoles.forEach(hole => {
      if (+hole.no <= +maxHoleComplete) {
        targetPar += +hole.par;
      }
    });
    participant.holeScores.forEach(holeScore => {
      if (+holeScore.hole <= +maxHoleComplete) {
        usersScore += +holeScore.score;
      }
    });
    return usersScore - targetPar;
  }

  sortScores(participants: any[]) {
    if (participants) {
      participants.sort((a, b) => {
        return a.score - b.score;
      });
    }
  }

  
/*
  getAllGroups(event: Event) {
    this.subscriptions.push(this.groupService.getAll(event.id.toString(), this.scoringType).subscribe(response => {
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
      console.log(event);
      this.getScorecard(event);
    });
  }

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
  */
  

}
