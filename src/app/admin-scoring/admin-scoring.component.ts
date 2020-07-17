import { Component, OnInit, OnDestroy, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { GroupService } from '../services/group.service';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../services/event.service';
import { Group } from '../models/Group';
import { Subscription } from 'rxjs';
import { Event } from '../models/Event';
import { Scorecard } from '../models/Scorecard';
import { GroupParticipant } from '../models/GroupParticipant';
import { HoleScore } from '../models/HoleScore';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Scoring page for 'Admins'.
 * Grant rights to editing participant's scores OR make scores official.
 * Access granted by a password entered needing to match the event password
 */
@Component({
  selector: 'app-admin-scoring',
  templateUrl: './admin-scoring.component.html',
  styleUrls: ['./admin-scoring.component.scss']
})
export class AdminScoringComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  eventId: string;
  eventTypeId: string;
  event: Event;
  loadingPercent: number;
  groups: Group[];
  scorecard: Scorecard;
  columns: string[] = ['name'];
  holeColumns = [];
  parColumns = [];
  divisions: any[];
  divisionSelected;
  divisionParticipants: GroupParticipant[];
  dialogRef: MatDialogRef<any>;
  @ViewChildren('scoreInputs') scoreInputs: QueryList<any>;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
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
        this.getGroups();
      } else {
        console.error(response);
      }
    }));
  }

  getGroups() {
    this.subscriptions.push(this.groupService.getAll(this.eventId, this.eventTypeId).subscribe(response => {
      if (response.status === 200) {
        this.groups = response.payload;
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
        this.setColumns();
        this.setLoadingPercent(80);
        this.getDivisions();
      } else {
        console.error(response);
      }
    }));
  }

  setColumns() {
    this.holeColumns.push('hole');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.holeColumns.push('h'+hole.no);
    });
    this.parColumns.push('par');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.parColumns.push('p'+hole.no);
      this.columns.push(hole.no.toString());
    });
  }

  getDivisions() {
    this.subscriptions.push(this.eventService.getAllDivisions(this.eventTypeId).subscribe(response => {
      if (response.status === 200) {
        this.divisions = response.payload;
        this.checkScores();
        this.setLoadingPercent(100);
      } else {
        console.error(response);
      }
    }));
  }

  onDivisionSelected() {
    this.divisionParticipants = [];
    this.groups.forEach(group => {
      group.groupParticipants.forEach(participant => {
        if (participant.divisions[0].id === this.divisionSelected.id) {
          this.divisionParticipants.push(participant);
        }
      });
    });
  }

  /**
   * Get score on current hole for a participant
   * @param participant Group participant
   */
  getHoleScore(participant: GroupParticipant, hole: number): number {
    const holeScore: HoleScore = participant.holeScores.find(x => +x.hole === +hole);
    return holeScore && holeScore.id ? holeScore.score : null;
  }

  getDatasource(data) {
    return new MatTableDataSource(data);
  }

  editScores(participant: GroupParticipant, dialog) {
    this.dialogRef = this.dialog.open(dialog, { data: participant, autoFocus: false });
  }

  showEdit(participant: GroupParticipant, dialog) {
    this.close();
    this.scorecard.scorecardHoles.forEach(hole => {
      const holeScore = participant.holeScores.find(x => +x.hole === +hole.no);
      if (!holeScore) {
        participant.holeScores.push(new HoleScore(null, participant.scoreId, this.getTeeBlockHoleId(+hole.no, this.getDefaultTeeBlockId()), +hole.no, null, false, false));
      }
    })
    console.log(participant);
    this.dialogRef = this.dialog.open(dialog, { data: participant, autoFocus: false });
  }

  getTeeBlockHoleId(holeNum: number, teeBlockId: number) {
    return this.scorecard.scorecardHoles.find(x => +x.no === +holeNum).teeBlocks.find(block => +block.id === +teeBlockId).teeBlockHoleId;
  }

  makeScoresOfficial(participant: GroupParticipant, password) {
    if (!password || password === '') {
      this.snackbar.open('Please enter password', 'dismiss');
    } else {
      let missingScores;
      this.scorecard.scorecardHoles.forEach(hole => {
        const holeScore = participant.holeScores.find(x => +x.hole === +hole.no);
        if (!holeScore) {
          missingScores = true;
        }
      });
      if (missingScores && missingScores === true) {
        this.snackbar.open('Please ensure player has scores for ALL holes first.', 'dismiss');
      } else {
        this.setOfficial(participant, password);
      }
    }
  }

  /**
   * Update the participant's hole scores in the database, setting the official flag to true
   * @param participant Group Participant
   * @param password Password entered by user to verify access
   */
  setOfficial(participant: GroupParticipant, password: string) {
    this.subscriptions.push(this.groupService.makeScoresOfficial(participant, password, this.event.id).subscribe(response => {
      if (response.status === 200) {
        this.close();
        this.snackbar.open('Scores are official!', '', { duration: 1100 });
        participant.holeScores.forEach(x => x.official === true);
      } else {
        console.error(response);
      }
    }));
  }

  close() {
    this.dialogRef.close();
  }

  /**
   * Persist a participants scores
   * @param participant Group Participant
   * @param password User entered password, verifies access rights
   */
  saveScores(participant: GroupParticipant, password: string) {
    if (!password || password === '') {
      this.snackbar.open('Please enter password', 'dismiss');
    } else {
      this.groupService.saveParticipantScoreByPassword(participant, password, this.event.id).subscribe(response => {
        if (response.status === 200) {
          this.close();
          participant = response.payload;
          this.snackbar.open('Scores saved!', '', { duration: 1100 });
        } else if (response.status === 509 ) {
          this.snackbar.open('Invalid password', 'dismiss');
        } else {
          console.error(response);
        }
      });
    }
  }

  /**
   * Check if each user in group has scores. If score id is null then we create an initial score record for the participant
   */
  checkScores() {
    this.groups.forEach(group => {
      group.groupParticipants.forEach(participant => {
        if (participant.scoreId === null) {
          this.initScore(participant);
        } 
      });
    });
  }

  /**
   * Create a score record for the user, returns the participant with their scoreId set to their new score record
   * @param participant Group Participant
   */
  initScore(participant: GroupParticipant) {
    this.subscriptions.push(this.groupService.initScore(participant, this.event.scorecardId, this.getDefaultTeeBlockId()).subscribe(response => {
      if (response.status === 201) {
        participant = response.payload
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

  /**
   * Fired when a number is added to a hole input by user. We move the focuc to the next input/hole
   * @param index Index of the array of objs, maps to the index for the input elements in the query list
   */
  onScoreEnter(index: number) {
    const inputs = this.scoreInputs.toArray();
    const element: ElementRef = inputs[index + 1];
    if (element) {
      element.nativeElement.focus();
      element.nativeElement.select();
    }
  }

}
