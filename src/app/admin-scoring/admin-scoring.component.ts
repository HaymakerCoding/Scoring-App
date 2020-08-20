import { Component, OnInit, OnDestroy, QueryList, ViewChildren, ElementRef, TemplateRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
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
import { Season } from '../models/Season';
import { ScoringType } from '../main/main.component';

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
  events: Event[] = [];
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
  season: Season;
  private password: string;
  validPassword: boolean;
  scoringType: ScoringType;

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.validPassword = false;
    this.getRouteParams();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent = percent;
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

  getRouteParams() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(( params: Params ) => {
      this.eventTypeId = params.eventTypeId;
      this.eventId = params.eventId;
      this.setScoringType();
      this.setLoadingPercent(10);
      this.getCurrentSeason();
    }));
  }

  /**
   * Get the tournaments Current Season by year
   */
  getCurrentSeason() {
    const year = new Date().getFullYear();
    this.subscriptions.push(this.eventService.getSeason(this.eventTypeId.toString(), year.toString()).subscribe(response => {
      if (response.status === 200) {
        this.season = response.payload;
        this.setLoadingPercent(20);
        this.getEvents();
      } else {
        console.error(response);
      }
    }));
  }

  getEvents() {
    this.subscriptions.push(this.eventService.getAllEvents(this.season).subscribe(response => {
      if (response.status === 200) {
        this.events = response.payload;
        this.setLoadingPercent(40);
        if (this.eventId) {
          this.event = this.events.find(x => +x.id === +this.eventId);
        } else {
          this.event = this.events[0];
        }
        console.log(this.event);
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
        this.setLoadingPercent(100);
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Setup the columns for the tables of holes scores.
   * Mat table uses 3 headers of columns
   */
  setColumns() {
    this.holeColumns.push('hole');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.holeColumns.push('h'+hole.no);
      
    });
    this.holeColumns.push('total');
    this.parColumns.push('par');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.parColumns.push('p'+hole.no);
      this.columns.push(hole.no.toString());
    });
    this.parColumns.push('parTotal');
    this.columns.push('totalScore');
    
  }

  /**
   * Get all groups/participants for the event
   */
  getGroups() {
    this.subscriptions.push(this.groupService.getAll(this.event.id.toString(), this.scoringType).subscribe(response => {
      if (response.status === 200) {
        this.groups = response.payload;
        console.log(this.groups);
        this.filterParticipantsByDivision();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Reload groups and filter by division every time user changes/selects a division
   */
  onDivisionSelected() {
    this.setLoadingPercent(20);
    this.getGroups();
  }

  /**
   * Filter all groups into a list of participants with division matching the selected division
   */
  filterParticipantsByDivision() {
    this.divisionParticipants = [];
    this.groups.forEach(group => {
      group.groupParticipants.forEach(participant => {
        if (this.scoringType === ScoringType.INDIVIDUAL) {
          if (participant.divisions[0].id === this.divisionSelected.id) {
            this.divisionParticipants.push(participant);
          }
        } else {
          
        }
      });
    });
    //now sort alpha by name
    this.divisionParticipants.sort((a, b) => {
      return a.fullName > b.fullName ? 1: a.fullName < b.fullName ? -1 : 0;
    });
    this.setLoadingPercent(100);
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
        participant.holeScores.push(new HoleScore(null, participant.scoreId, this.getTeeBlockHoleId(+hole.no, this.getDefaultTeeBlockId()), +hole.no, null, 0, false));
      }
    })
    participant.holeScores.sort((a, b) => {
      return +a.hole - +b.hole;
    });
    this.dialogRef = this.dialog.open(dialog, { data: participant, autoFocus: false });
  }

  getTeeBlockHoleId(holeNum: number, teeBlockId: number) {
    return this.scorecard.scorecardHoles.find(x => +x.no === +holeNum).teeBlockHoles.find(block => +block.teeBlockId === +teeBlockId).id;
  }

  /**
   * On user selecting to make a participants scores official.
   * Check password was entered and holes for all scores set. then send to function that updates datbase
   * @param participant Group participant
   * @param password User entered password
   */
  makeScoresOfficial(participant: GroupParticipant) {
    if (!this.password || this.password === '') {
      this.validPassword = false;
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
        this.setOfficial(participant, this.password);
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
        participant.holeScores.forEach(x => x.official = 1);
      } else if (response.status === 509 ) {
        this.snackbar.open('Invalid password', 'dismiss');
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
  saveScores(participant: GroupParticipant) {
    if (!this.password || this.password === '') {
      this.validPassword = false;
    } else {
      this.groupService.saveParticipantScoreByPassword(participant, this.password, this.event.id).subscribe(response => {
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
  checkScores() {
    const participantsToInit: GroupParticipant[] = [];
    this.groups.forEach(group => {
      group.groupParticipants.forEach(participant => {
        if (participant.scoreId === null) {
          participantsToInit.push(participant);
        } 
      });
    });
    if (participantsToInit.length > 0) {
      this.initScores(participantsToInit);
    }
  }
  initScores(participants: GroupParticipant[]) {
    const teeBlock = this.getDefaultTeeBlockId();
    if (teeBlock) {
      this.subscriptions.push(this.groupService.initMultipleScores(participants, this.event.scorecardId, teeBlock).subscribe(response => {
        if (response.status === 201) {
          participants = response.payload
        } else {
          console.error(response);
        }
      }));
    } else {
      console.error('Error, no default tee block found on the scorecard');
    }
  }
  */

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
      return null;
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

  /**
   * Check if the participants scores are flagged as official
   * @param participant Group Participant
   */
  hasOfficialScores(participant: GroupParticipant) {
    let offical = true;
    const holeScores = participant.holeScores;
    if (holeScores.length < 1) {
      return false;
    } else {
      holeScores.forEach(x => {
        if (+x.official === 0) {
          offical = false;
        }
      });
    }
    return offical;
  }

  /**
   * Get par total for the scorecard
   */
  getParTotal(): number {
    let parTotal = 0;
    this.scorecard.scorecardHoles.forEach(x => {
      parTotal += +x.par;
    });
    return parTotal;
  }

  /**
   * Return the participants current score.
   * Compare their hole scores total to toal pars.
   * @param participant Grooup Participant
   */
  getScore(participant: GroupParticipant): number {
    let targetPar = 0;
    let usersScore = 0;
    participant.holeScores.forEach(holeScore => {
      if (holeScore.id) {
        usersScore += +holeScore.score;
        targetPar += +this.scorecard.scorecardHoles.find(x => +x.no === +holeScore.hole).par;
      }
    });
    return +usersScore - +targetPar;
  }

  /**
   * Check for any duplicate holeScores for a user.
   * Return number found
   */
  checkNumIssues(): number {
    let issues = 0;
    this.divisionParticipants.forEach(participant => {
      this.scorecard.scorecardHoles.forEach(hole => {
        const found = participant.holeScores.filter(x => +x.teeBlockHoleId === +hole.teeBlockHoles[0].holeId);
        if (found.length > 1) {
          issues++;
        }
      });
    });
    return issues;
  }

  /**
   * Gather all problems (duplicates) and pass them to a dialog for user to view/edit
   * @param dialog Dialog to open
   */
  showProblems(dialog: TemplateRef<any>) {
    const problems: Problem[] = [];
    this.divisionParticipants.forEach(participant => {
      this.scorecard.scorecardHoles.forEach(hole => {
        const found: HoleScore[] = participant.holeScores.filter(x => +x.teeBlockHoleId === +hole.teeBlockHoles[0].holeId);
        if (found.length > 1) {
          const problemHoles: HoleScore[] = [];
          for (let f of found) {
            problemHoles.push(f);
          }
          problems.push({ participant, holeScores: problemHoles });
        }
      });
    });
    if (problems.length > 0) {
      this.dialogRef = this.dialog.open(dialog, { data: problems });
    }
  }

  /**
   * Remove a hole score for a participant
   * @param holeScore Hole Score to remove
   * @param participant Group participant
   */
  deleteDuplicateScore(holeScore: HoleScore, participant: GroupParticipant) {
    if (confirm('Are you sure you want to permanently delete this player score?') === true) {
      this.setLoadingPercent(20);
      this.close();
      this.subscriptions.push(this.eventService.verifyEventPassword(this.event.id, this.password).subscribe(response => {
        if (response.status === 200) {
          this.setLoadingPercent(50);
          this.subscriptions.push(this.groupService.deleteHoleScore(holeScore.id.toString()).subscribe(response2 => {
            if (response2.status === 200) {
              this.setLoadingPercent(100);
              participant.holeScores = participant.holeScores.filter(x => +x.id !== +holeScore.id);
            } else {
              console.error(response2);
            }
          }));
        } else {
          this.setLoadingPercent(100);
          this.validPassword = false;
          console.error(response);
        }
      }));
    }
  }

  /**
   * User changed the event.
   * Dump data specific to event and fetch new from db
   */
  onEventSelected() {
    this.setLoadingPercent(20);
    this.columns = ['name'];
    this.holeColumns = [];
    this.parColumns = [];
    this.divisionSelected = null;
    this.groups = [];
    this.divisionParticipants = [];
    this.validPassword = false;
    this.password = null;
    this.getScorecard();
  }

  onSubmitPassword(password) {
    this.subscriptions.push(this.eventService.verifyEventPassword(this.event.id, password).subscribe(response => {
      if (response.status === 200) {
        this.password = password;
        this.validPassword = true;
      } else {
        this.snackbar.open('Invalid password. Note: password may be specific to event', 'dismiss');
        this.validPassword = false;
        console.error(response);
      }
    }));
  }
}

interface Problem {
  participant: GroupParticipant;
  holeScores: HoleScore[]
}
