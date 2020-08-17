import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { GroupService } from '../services/group.service';
import { Scorecard } from '../models/Scorecard';
import { GroupParticipant } from '../models/GroupParticipant';
import { DivisionService } from '../services/division.service';
import { Season } from '../models/Season';

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
  events: Event[];
  loadingPercent: number;
  group: Group;
  scorecard: Scorecard;
  scoreInitialized: number;
  screens: Screen[] = [Screen.ENTERSCORES, Screen.SCORES, Screen.LEADERBOARD];
  currentScreen: Screen;
  season: Season;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private router: Router,
    private divisionService: DivisionService
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

  /**
   * Get the event focused on scoring for
   * @param eventId 
   */
  getEvent(eventId: string) {
    this.subscriptions.push(this.eventService.get(eventId).subscribe(response => {
      if (response.status === 200) {
        this.event = response.payload;
        this.setLoadingPercent(40);
        this.getSeason();
      } else {
        console.error(response);
      }
    }));
  }

  getSeason() {
    const year = new Date().getFullYear();
    this.subscriptions.push(this.eventService.getSeason(this.eventTypeId, year.toString()).subscribe(response => {
      if (response.status === 200) {
        this.season = response.payload
        this.setLoadingPercent(50);
        this.getEevents();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all events in the tournament. For total scoring of all rounds(events)
   */
  getEevents() {
    this.subscriptions.push(this.eventService.getAllEvents(this.season).subscribe(response => {
      if (response.status === 200) {
        this.events = response.payload;
        this.setLoadingPercent(60);
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
        this.groupService.setGroup(this.group);
        this.setLoadingPercent(70);
        this.getUsersDivision();
      } else {
        console.error(response);
      }
    }));
  }

  getUsersDivision() {
    this.subscriptions.push(this.divisionService.getUsersDivisionFromServer(this.eventTypeId).subscribe(response => {
      if (response.status === 200) {
        this.divisionService.setUsersDivision(response.payload);
        this.setLoadingPercent(80);
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
        this.setLoadingPercent(90);
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
    this.subscriptions.push(this.groupService.initScore(participant, this.event.scorecardId, this.getDefaultTeeBlockId()).subscribe(response => {
      if (response.status === 201) {
        participant = response.payload
        if (this.scoreInitialized === this.group.groupParticipants.length) {
          this.setLoadingPercent(100);
        }
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Temporary, get the teeblock id from a teeblock set on the first array of teeblocks from the scorecard.
   * This is just for when we don't care about teeblocks. For real teeblock use we need to pull the members assigned tee block id.
   * Either way, the scorecard for the course NEEDS to have the teeblock set
   */
  getDefaultTeeBlockId() {
    const defaultTeeBlock = this.scorecard.scorecardHoles[0].teeBlocks[0].id;
    if (defaultTeeBlock) {
      return defaultTeeBlock;
    } else {
      console.error('Error, no default tee block found on the scorecard');
    }
  }

  goToChooseEvent() {
    this.router.navigate(['/'])
  }


}

enum Screen{
  ENTERSCORES = 'Enter Scores',
  SCORES = 'Scores',
  LEADERBOARD = 'Leaderboard'
}
