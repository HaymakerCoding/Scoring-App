import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { GroupService } from '../services/group.service';
import { DivisionService } from '../services/division.service';
import { Subscription } from 'rxjs';
import { GroupParticipant } from '../models/GroupParticipant';
import { HoleScore } from '../models/HoleScore';

/**
 * Show a leaderboard view of all players.
 * Filtered by division selected.
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

  group: Group;
  usersDivision: any;
  loadingPercent: number;
  subscriptions: Subscription[] = [];
  groups: Group[];
  divisionParticipants: GroupParticipant[] = [];

  constructor(
    private groupService: GroupService,
    private divisionService: DivisionService
  ) { }

  ngOnInit(): void {
    this.group = this.groupService.getGroup();
    this.usersDivision = this.divisionService.getUsersDivision();
    this.getAllGroups();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent = percent;
  }

  getAllGroups() {
    this.subscriptions.push(this.groupService.getAll(this.event.id.toString(), this.eventTypeId.toString()).subscribe(response => {
      if (response.status === 200) {
        this.groups = response.payload;
        this.setLoadingPercent(40);
        this.filterGroupsByDivision();
      } else {
        console.error(response);
      }
    }));
  }

  filterGroupsByDivision() {
    this.groups.forEach(group => {
      group.groupParticipants.forEach(participant => {
        participant.divisions.forEach( division => {
          if (+division.id === +this.usersDivision.id) {
            this.divisionParticipants.push(participant);
          }
        });
      });
    });
    this.setLoadingPercent(70);
    this.setCurrentScore();
  }

  /**
   * Check and set each participants score.
   * Score is calculated by comparing total par of all holes complete against the players par total
   */
  setCurrentScore() {
    this.divisionParticipants.forEach(participant => {
      participant.score = this.getScore(participant, this.getHoleComplete(participant));
    });
    this.setLoadingPercent(90);
    this.sortScores();
  }

  sortScores() {
    this.divisionParticipants.sort((a, b) => {
      return a.score - b.score;
    });
    this.setLoadingPercent(100);
  }

  /**
   * Get the max hole completed by a participant
   */
  getHoleComplete(participant: GroupParticipant): number {
    let complete = 0;
    const holeScores = participant.holeScores;
    if (holeScores) {
      participant.holeScores.forEach(holeScore => {
        if (holeScore.id) {
          complete++;
        }
      });
    }
    return complete;
  }

  /**
   * Return the participants current score.
   * Compare their hole scores total to toal pars.
   * @param participant Grooup Participant
   * @param maxHoleComplete The Max hole the participant has played up to
   */
  getScore(participant: GroupParticipant, maxHoleComplete: number): number {
    let targetPar = 0;
    let usersScore = 0;
    participant.holeScores.forEach(holeScore => {
      if (holeScore.id) {
        usersScore += +holeScore.score;
        targetPar += +this.scorecard.scorecardHoles.find(x => +x.no === +holeScore.hole).par;
      }
    });
    return usersScore - targetPar;
  }

  

}
