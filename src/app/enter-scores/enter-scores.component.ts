import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SlammerEvent } from '../models/SlammerEvent';
import { Subscription } from 'rxjs';
import { SlammerEventService } from '../services/slammer-event.service';
import { Group } from '../models/Group';
import { Par } from '../models/Par';
import { GroupScoresService } from '../services/group-scores.service';
import { MatSnackBar } from '@angular/material';

/**
 * Main component for entering scores for a golf event.
 * User gets a view of their group and can adjust scores per hole and save scores to the database.
 *
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-enter-scores',
  templateUrl: './enter-scores.component.html',
  styleUrls: ['./enter-scores.component.scss']
})
export class EnterScoresComponent implements OnInit, OnDestroy {

  @Input() event: SlammerEvent;
  @Input() pars: Par[];
  groupSelected: number;
  holes: number[];
  startHoleSelected: number;
  holeSelected: number;
  subscriptions: Subscription[] = [];
  group: Group;
  loading: boolean;
  activePlayerId: number; // the slammer member id of the current active player selected to view match outcome for
  activePlayerNumber: number;
  unsavedChanges: boolean;

  constructor(
    private eventService: SlammerEventService,
    private groupScoreService: GroupScoresService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.unsavedChanges = false;
    this.groupSelected = this.event.groupNumbers[0];
    this.groupScoreService.setEventId(this.event.id);
    this.initTrackUnsavedChanges();
    this.setHoles();
    this.getGroup();
  }

  /**
   * Track unsaved changes to scores
   */
  initTrackUnsavedChanges() {
    this.groupScoreService.hasUnsavedScores().subscribe(response => {
      this.unsavedChanges = response;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * When user goes to next hole. Load new default scores for new hole.
   */
  onHoleChange() {
    this.loadDefaultHoleScores(this.holeSelected);
  }

  /**
   * Set the default scores for a hole to the par for that hole
   * IF no scores set for that hole add scores with par as default score
   * @param holeNum Hole number
   */
  loadDefaultHoleScores(holeNum) {
    let hole;
    if (this.group.player1id) {
      hole = this.group.player1scores.find(x => +x.hole === +holeNum);
      if (!hole) {
        this.group.player1scores.push({ hole: holeNum, score: this.getPar(holeNum)});
      } else if (hole.score === 0) {
        hole.score = this.getPar(holeNum);
      }
    }
    if (this.group.player2id) {
      hole = this.group.player2scores.find(x => +x.hole === +holeNum);
      if (!hole) {
        this.group.player2scores.push({ hole: holeNum, score: this.getPar(holeNum)});
      } else if (hole.score === 0) {
        hole.score = this.getPar(holeNum);
      }
    }
    if (this.group.player3id) {
      hole = this.group.player3scores.find(x => +x.hole === +holeNum);
      if (!hole) {
        this.group.player3scores.push({ hole: holeNum, score: this.getPar(holeNum)});
      } else if (hole.score === 0) {
        hole.score = this.getPar(holeNum);
      }
    }
    if (this.group.player4id) {
      hole = this.group.player4scores.find(x => +x.hole === +holeNum);
      if (!hole) {
        this.group.player4scores.push({ hole: holeNum, score: this.getPar(holeNum)});
      } else if (hole.score === 0) {
        hole.score = this.getPar(holeNum);
      }
    }
  }

  /**
   * Initialize the scoring arrays for each player
   */
  initScores() {
    if (this.group.player1id) {
      this.group.player1scores = [];
    }
    if (this.group.player2id) {
      this.group.player2scores = [];
    }
    if (this.group.player3id) {
      this.group.player3scores = [];
    }
    if (this.group.player4id) {
      this.group.player4scores = [];
    }
  }

  /**
   * Increase the score for a player on the hole selected.
   * @param playerNum Player number in group
   */
  changeScore(playerNum, value) {
    let scores;
    switch (playerNum) {
      case 1: {
        scores = this.group.player1scores;
        break;
      }
      case 2: {
        scores = this.group.player2scores;
        break;
      }
      case 3: {
        scores = this.group.player3scores;
        break;
      }
      case 4: {
        scores = this.group.player4scores;
        break;
      }
    }
    const hole = scores.find(x => x.hole === this.holeSelected);
    hole.score += value;
    /*
    if (hole) {
      hole.score !== 0 ? hole.score += value : hole.score = (this.getPar(this.holeSelected) + value);
    } else {
      scores.push( { hole: this.holeSelected, score: this.getPar(this.holeSelected) + value});
    }
    */
    this.groupScoreService.setGroup(this.group);
    this.groupScoreService.setUnsavedScores(true);
  }

  /**
   * Return player's score for a hole, or if no score give the par for that hole as a starting score
   * @param holeNum Hole number
   * @param playerNum Player number in group
   */
  getHoleScore(holeNum, playerNum) {
    switch (playerNum) {
      case 1: {
        const hole = this.group.player1scores.find(x => x.hole === holeNum);
        return hole.score;
        // return hole && hole.score !== 0 ? hole.score : this.pars.find(x => x.hole === holeNum).par;
      }
      case 2: {
        const hole = this.group.player2scores.find(x => x.hole === holeNum);
        return hole.score;
        // return hole && hole.score !== 0 ? hole.score : this.pars.find(x => x.hole === holeNum).par;
      }
      case 3: {
        const hole = this.group.player3scores.find(x => x.hole === holeNum);
        return hole.score;
        // return hole && hole.score !== 0 ? hole.score  : this.pars.find(x => x.hole === holeNum).par;
      }
      case 4: {
        const hole = this.group.player4scores.find(x => x.hole === holeNum);
        return hole.score;
        // return hole && hole.score !== 0 ? hole.score  : this.pars.find(x => x.hole === holeNum).par;
      }
      default: {
        console.error('Error in getting hole score, no matching player number');
      }
    }
  }

  /**
   * Get the par for a specific hole
   * @param holeNum Hole number
   */
  getPar(holeNum) {
    return this.pars.find(x => x.hole === holeNum).par;
  }

  setHoles() {
    this.holes = [];
    this.holeSelected = 1;
    for (let x = 1; x < 19; x++) {
      this.holes.push(x);
    }
    this.startHoleSelected = this.holes[0];
  }

  /**
   * Get the golf group we are scoring for. Groups are up to 4 players
   * Group is based on logged in user being in the group
   */
  getGroup() {
    this.loading = true;
    this.subscriptions.push(this.groupScoreService.getMembersGroup(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.group = response.payload;
        this.groupScoreService.setGroup(this.group);
        this.activePlayerId = this.group.player1id;
        this.activePlayerNumber = 1;
        this.initScores();
        this.getGroupScores();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Check the database for any scores set for this group.
   * We send the group and receive the group back with any changes to scores done on server
   */
  getGroupScores() {
    this.subscriptions.push(this.eventService.getGroupScores(this.event.id, this.group).subscribe(response => {
      if (response.status === 200) {
        // payload holds the returned group with any scores set
        this.group = response.payload;
        this.loadDefaultHoleScores(this.holeSelected);
        this.groupScoreService.setGroup(this.group);
      } else {
        console.error(response);
      }
      this.loading = false;
    }));
  }

  /**
   * Check whether a player is the active selected player
   * @param playerId Player's slammer member id
   */
  isActivePlayer(playerId): boolean {
    return +this.activePlayerId === +playerId;
  }

  /**
   * Get a results text for how the match is going between selected player and the opponent supplied
   * @param opponentId Opponent's slammer ID
   */
  getMatchResult(opponentNumber) {
    const holes: number[] = [];
    for ( let x = 1; x <= this.holeSelected; x++) {
      holes.push(x);
    }
    return this.calcuteResult(holes, this.activePlayerNumber, opponentNumber);
  }

  /**
   * Get a result between 2 players up to a certain point.
   * @param holes An array of hole numbers for all holes up to the one currently selected
   * @param activePlayerNumber The group number for the selected player
   * @param opponentNumber The group number for the opponent comparing with
   */
  calcuteResult(holes: number[], activePlayerNumber, opponentNumber) {
    let p1Total = 0;
    let p2Total = 0;
    for (const hole of holes) {
      const p1score = this.getHoleScore(hole, activePlayerNumber);
      const p2score = this.getHoleScore(hole, opponentNumber);
      if (p1score < p2score) {
        p1Total++;
      } else if (p2score < p1score) {
        p2Total++;
      }
    }
    const difference = p1Total - p2Total;
    if (activePlayerNumber === opponentNumber) {
      return null;
    }
    return p1Total > p2Total ? difference + ' Up' : p2Total > p1Total ? difference + ' Down' : 'All Square';
  }

  /**
   * Submit a groups scores to the db
   * Uses the group and event ID set in the group score service
   */
  submitScores() {
    this.groupScoreService.setGroup(this.group);
    this.subscriptions.push(this.groupScoreService.submitScores().subscribe(response => {
      if (response.status === 200) {
        this.groupScoreService.setUnsavedScores(false);
        this.snackbar.open('Scores saved', '', { duration : 1200 });
        // Go to next hole
        if (this.holeSelected < this.holes[this.holes.length - 1]) {
          this.holeSelected += 1;
        }
        this.onHoleChange();
      } else {
        console.error(response);
      }
    }));
  }




}
