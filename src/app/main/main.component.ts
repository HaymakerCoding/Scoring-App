import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { GroupService } from '../services/group.service';
import { Scorecard } from '../models/Scorecard';
import { GroupParticipant } from '../models/GroupParticipant';
import { GroupScoresService } from '../services/group-scores.service';

/**
 * Main screen for scoring for ALL event types
 * 
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  eventId: string;
  eventTypeId: string;
  event: Event;
  loadingPercent: number;
  group: Group;
  scorecard: Scorecard;
  scoreInitialized: number;
  screens: Screen[] = [Screen.ENTERSCORES, Screen.SUMMARY, Screen.LEADERBOARD];
  currentScreen: Screen;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private groupScoreService: GroupScoresService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.scoreInitialized = 0;
    this.currentScreen = this.screens[0];
    this.getRouteParams();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent = percent;
  }

  getRouteParams() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(( params: Params ) => {
      this.eventTypeId = params.eventTypeId;
      this.eventId = params.eventId;
      this.setLoadingPercent(10);
      this.getEvent(this.eventId);
    }));
  }

  getEvent(eventId: string) {
    this.subscriptions.push(this.eventService.get(eventId).subscribe(response => {
      if (response.status === 200) {
        this.event = response.payload;
        this.setLoadingPercent(40);
        this.getUsersGroup();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get the group of player that the user logged in belongs to for this event
   */
  getUsersGroup() {
    this.subscriptions.push(this.groupService.getUsersGroup(this.eventId).subscribe(response => {
      if (response.status === 200) {
        this.group = response.payload;
        this.setLoadingPercent(60);
        this.getScorecard();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get the scorecard for the event
   */
  getScorecard() {
    this.subscriptions.push(this.eventService.getScorecard(this.event.scorecardId.toString()).subscribe(response => {
      if (response.status === 200) {
        this.scorecard = response.payload;
        console.log(this.scorecard);
        this.setLoadingPercent(80);
        this.checkScores();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Check if each user in group has scores. If score id is null then we create an initial score record for the participant
   */
  checkScores() {
    this.group.groupParticipants.forEach(participant => {
      if (participant.scoreId === null) {
        this.initScore(participant);
      } else {
        this.scoreInitialized ++;
        if (this.scoreInitialized === this.group.groupParticipants.length) {
          this.setLoadingPercent(100);
        }
      }
    })
  }

  /**
   * Create a score record for the user, returns the participant with their scoreId set to their new score record
   * @param participant Group Participant
   */
  initScore(participant: GroupParticipant) {
    this.subscriptions.push(this.groupScoreService.initScore(participant, this.event.scorecardId).subscribe(response => {
      if (response.status === 200) {
        participant = response.payload
        if (this.scoreInitialized === this.group.groupParticipants.length) {
          this.setLoadingPercent(100);
        }
      } else {
        console.error(response);
      }
    }));
  }

  goToChooseEvent() {
    this.router.navigate(['/'])
  }


}

enum Screen{
  ENTERSCORES = 'Enter Scores',
  SUMMARY = 'Summary',
  LEADERBOARD = 'Leaderboard'
}
