import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { GroupService } from '../services/group.service';
import { Scorecard } from '../models/Scorecard';
import { DivisionService } from '../services/division.service';
import { Season } from '../models/Season';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Main screen for scoring for ALL event types
 * Child components are included depending on 'screen' being accesed by user
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
  scoringType: ScoringType;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private router: Router,
    private divisionService: DivisionService,
    private snackbar: MatSnackBar
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
      this.setScoringType();
      this.getEvent(this.eventId);
    }));
  }

  setScoringType() {
    switch (+this.eventTypeId) {
      case 1: {
        this.scoringType = ScoringType.TEAM;
        break;
      }
      case 3: {
        this.scoringType = ScoringType.INDIVIDUAL;
        break;
      }
      default: {
        this.snackbar.open('Error - scoring type not set for this event type');
        break;
      }
    }
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
        this.getEvents();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get all events in the tournament. For total scoring of all rounds(events)
   */
  getEvents() {
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
    const type = +this.eventTypeId === 1 ? 'pairs' : 'individual';
    this.subscriptions.push(this.groupService.getUsersGroup(this.eventId, type).subscribe(response => {
      if (response.status === 200) {
        this.group = response.payload;
        console.log(this.group);
        if (!this.group.id) {
          this.snackbar.open('This user does not have a group for this event.', 'dismiss');
        } else {
          this.groupService.setGroup(this.group);
          this.setLoadingPercent(70);
          this.getUsersDivision();
        }
      } else {
        console.error(response);
      }
    }));
  }

  getUsersDivision() {
    this.subscriptions.push(this.divisionService.getUsersDivisionFromServer(this.event.id.toString()).subscribe(response => {
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
        this.setLoadingPercent(100);
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
    const defaultTeeBlock = this.scorecard.scorecardHoles[0].teeBlockHoles[0].teeBlockId;
    if (defaultTeeBlock) {
      return defaultTeeBlock;
    } else {
      console.error('Error, no default tee block found on the scorecard');
    }
  }

  goToChooseEvent() {
    this.router.navigate(['/'])
  }

  getTournamentLogo() {
    switch (+this.eventTypeId) {
      case 1: return './assets/scramble2.png';
      case 3: return 'https://clubeg.golf/Images/Logos/ottawacitizenchampionship300.png';
      default: return 'https://clubeg.golf/Images/Logos/clubeg-golf200.png';
    }
  }


}

enum Screen{
  ENTERSCORES = 'Enter Scores',
  SCORES = 'Scores',
  LEADERBOARD = 'Leaderboard'
}

export enum ScoringType {
  INDIVIDUAL = 'individual',
  TEAM = 'team'
}
