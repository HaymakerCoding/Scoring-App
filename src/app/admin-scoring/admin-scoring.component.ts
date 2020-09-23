import { Component, OnInit, OnDestroy, QueryList, ViewChildren, ElementRef, TemplateRef, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { GroupService } from '../services/group.service';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../services/event.service';
import { Subscription } from 'rxjs';
import { Event } from '../models/Event';
import { Scorecard } from '../models/Scorecard';
import { HoleScore } from '../models/HoleScore';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Season } from '../models/Season';
import { ScoringType } from '../main/main.component';
import { Individual } from '../models/Individual';
import { Team } from '../models/Team';
import { EventParticipant } from '../models/EventParticipant';
import { ScoreService } from '../services/score.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { TournamentType } from '../models/EventBasic';
import { Tournament } from '../models/Tournament';
import { TournamentService } from '../services/tournament.service';

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

  scorecard: Scorecard;
  columns: string[] = ['name'];
  holeColumns = [];
  parColumns = [];
  divisions: any[];
  divisionSelected;
  dialogRef: MatDialogRef<any>;
  @ViewChildren('scoreInputs') scoreInputs: QueryList<any>;
  season: Season;
  private password: string;
  validPassword: boolean;
  scoringType: ScoringType;
  indivduals: Individual[];
  teams: Team[];
  results: Results;
  tournamentSelected: Tournament;
  tournaments: Tournament[] = [];

  constructor(
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private scoreService: ScoreService,
    private tournamentService: TournamentService
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

  getRouteParams() {
    this.subscriptions.push(this.activatedRoute.params.subscribe(( params: Params ) => {
      this.eventTypeId = params.eventTypeId;
      this.eventId = params.eventId;
      if (this.eventTypeId) {
        this.setScoringType();
        this.setLoadingPercent(10);
        this.getCurrentSeason();
      } else {
        this.getTournaments();
      }
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
      case 6: {
        this.scoringType = ScoringType.INDIVIDUAL;
        break;
      }
      default: {
        this.snackbar.open('Error - scoring type not set for this event type', 'dismiss');
        break;
      }
    }
  }

  getTournaments() {
    this.subscriptions.push(this.tournamentService.getAll().subscribe(response => {
      this.tournaments = response.payload;
      this.setLoadingPercent(100);
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
    this.subscriptions.push(this.eventService.getAllEvents(this.season, '1').subscribe(response => {
      this.setLoadingPercent(40);
      this.events = response.payload;
      if (this.eventId) {
        this.event = this.events.find(x => +x.id === +this.eventId);
      } else {
        this.event = this.events[0];
      }
      this.getScorecard();
    }));
  }

  /**
   * Get the scorecard for the event
   */
  getScorecard() {
    if (!this.event.scorecardId) {
      this.snackbar.open('Error: missing scorecard for this event (' + this.event.name + ')', 'dismiss');
      this.setLoadingPercent(100);
    } else {
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
  }

  /**
   * Setup the columns for the tables of holes scores.
   * Mat table uses 3 headers of columns
   */
  setColumns() {
    this.holeColumns.push('hole');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.holeColumns.push('h'+hole.no);
      if (+hole.no === 9) {
        this.holeColumns.push('front');
      } else if (+hole.no === 18) {
        this.holeColumns.push('back');
      }
    });
    this.holeColumns.push('total');
    this.holeColumns.push('playoff');
    this.holeColumns.push('L3label');
    this.holeColumns.push('L6label');
    this.parColumns.push('par');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.parColumns.push('p'+hole.no);
      if (+hole.no === 9) {
        this.parColumns.push('frontParTotal');
      } else if (+hole.no === 18) {
        this.parColumns.push('backParTotal');
      }
      this.columns.push(hole.no.toString());
      if (+hole.no === 9) {
        this.columns.push('frontPlayerTotal');
      }
      if (+hole.no === 18) {
        this.columns.push('backPlayerTotal');
      }
    });
    this.parColumns.push('parTotal');
    this.columns.push('totalScore');
    this.columns.push('playoffCheck');
    this.columns.push('L3');
    this.columns.push('L6');
  }

  getScores() {
    const eventIds: string[] = [];
    eventIds.push(this.event.id.toString());
    this.subscriptions.push(this.scoreService.getScores(eventIds, this.scoringType, this.divisionSelected.competitionId.toString()).subscribe(response => {
      this.results = response.payload;
      console.log(this.results.eventScores);
      this.setPos();
      this.setLoadingPercent(100);
    }));
  }

  getPlayersNames(participant) {
    return this.scoringType === ScoringType.TEAM ? participant.teamMembers[0].fullName + ' & ' + participant.teamMembers[1].fullName : participant.fullName;
  }

  /**
   * Reload groups and filter by division every time user changes/selects a division
   */
  onDivisionSelected() {
    this.setLoadingPercent(20);
    this.getScores();
  }
  
  /**
   * Get score on current hole for a participant
   * @param participant Group participant
   */
  getHoleScore(participant: EventParticipant, hole: number): number {
    const holeScore: HoleScore = participant.holeScores.find(x => +x.hole === +hole);
    return holeScore && holeScore.id ? holeScore.score : null;
  }

  getDatasource() {
    return new MatTableDataSource(this.results.eventScores[0].scores);
  }

  editScores(participant: EventParticipant, dialog) {
    this.dialogRef = this.dialog.open(dialog, { data: participant, autoFocus: false });
  }

  showEdit(participant: EventParticipant, dialog) {
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
  makeScoresOfficial(participant: EventParticipant, official: number) {
    if (!this.password || this.password === '') {
      this.validPassword = false;
    } else {
        if (official === 1) { 
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
          this.setOfficial(participant, this.password, official);
        }
      } else {
        this.setOfficial(participant, this.password, official);
      }
    }
  }

  /**
   * Update the participant's hole scores in the database, setting the official flag to true
   * @param participant Group Participant
   * @param password Password entered by user to verify access
   */
  setOfficial(participant: EventParticipant, password: string, official: number) {
    this.subscriptions.push(this.eventService.makeScoresOfficial(participant, password, this.event.id, official).subscribe(response => {
      if (response.status === 200) {
        this.close();
        this.snackbar.open('Scores are official!', '', { duration: 1100 });
        participant.holeScores.forEach(x => x.official = official);
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
   * @param participant Event Participant
   * @param password User entered password, verifies access rights
   */
  saveScores(participant: EventParticipant) {
    if (!this.password || this.password === '') {
      this.validPassword = false;
    } else {
      this.subscriptions.push(this.scoreService.saveParticipantScoreByPassword(participant, this.password, this.event.id).subscribe(response => {
        if (response.status === 200) {
          this.close();
          this.setLoadingPercent(25);
          this.getScores();
          this.snackbar.open('Scores saved!', '', { duration: 1100 });
        } else if (response.status === 509 ) {
          this.snackbar.open('Invalid password', 'dismiss');
        } else {
          console.error(response);
        }
      }));
    }
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
  hasOfficialScores(participant: EventParticipant) {
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
   * Check for any duplicate holeScores for a user.
   * Return number found
   */
  checkNumIssues(): number {
    let issues = 0;
    const eventScores = this.results.eventScores.find(x => +x.eventId === +this.event.id);
    if (eventScores) {
      eventScores.scores.forEach(participant => {
        this.scorecard.scorecardHoles.forEach(hole => {
          const found = participant.holeScores.filter(x => +x.teeBlockHoleId === +hole.teeBlockHoles[0].holeId);
          if (found.length > 1) {
            issues++;
          }
        });
      });
    }
    return issues;
  }

  /**
   * Gather all problems (duplicates) and pass them to a dialog for user to view/edit
   * @param dialog Dialog to open
   */
  showProblems(dialog: TemplateRef<any>) {
    const problems: Problem[] = [];
    this.teams.forEach(participant => {
      this.scorecard.scorecardHoles.forEach(hole => {
        const found: HoleScore[] = participant.holeScores.filter(x => +x.hole === +hole.no);
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
  deleteDuplicateScore(holeScore: HoleScore, participant: EventParticipant) {
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
   * User selected/changed tournament. Reload all data past event step
   */
  onTournamentSelected() {
    this.event = null;
    this.divisionSelected = null;
    this.eventTypeId = this.tournamentSelected.eventTypeId.toString();
    this.setScoringType();
    this.setLoadingPercent(10);
    this.getCurrentSeason();
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
    this.teams = [];
    this.indivduals = [];
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

  /**
   * Set all participants positions in the scoring by score. Ties are represented by appending with 'T'.
   * Ties are not increased in number visually, but those spots are still counted. Example 3 ties in the 2nd spot would all be 'T2' but after them it would continue at 4.
   */
  setPos() {
    let index = 0;
    let posNum = 1;
    let currentTiePos;
    this.results.participants.forEach(x => {
      if (index !== 0) {
        const aboveTeam = this.results.participants[index - 1];
        if (aboveTeam) {
          if (+aboveTeam.finalScore === +x.finalScore) {
            currentTiePos = currentTiePos ? currentTiePos : posNum;
            x.pos = 'T' + (currentTiePos);
            aboveTeam.pos = 'T' + (currentTiePos);
            posNum += 1;
          } else {
            currentTiePos = null;
            posNum += 1;
            x.pos = posNum;
          }
        }
      } else {
        x.pos = posNum;
      }
      index += 1;
    });
  }

  /**
   * Remove a member's hole score by its record id
   * @param participant Participant to remove score for could be individual or team
   * @param id PK
   */
  deleteHoleScore(participant, id: number) {
    if (!this.password || this.password === '') {
      this.validPassword = false;
    } else {
      this.subscriptions.push(this.eventService.deleteHoleScoreByPassword(id.toString(), this.password, this.event.id.toString()).subscribe(response => {
        if (response.status === 200) {
          participant.holeScores = participant.holeScores.filter(x => +x.id !== +id);
          this.snackbar.open('Hole Score Deleted!', '', {duration: 1100 });
        } else {
          console.error(response);
        }
      }));
    }
  }

  getFrontParTotal() {
    let total = 0;
    this.scorecard.scorecardHoles.forEach(hole => {
      if (+hole.no < 10) {
        total += +hole.par;
      }
    });
    return total;
  }

  getBackParTotal() {
    let total = 0;
    this.scorecard.scorecardHoles.forEach(hole => {
      if (+hole.no >= 10) {
        total += +hole.par;
      }
    });
    return total;
  }

  getPos(participant) {
    return this.results.participants.find(x => +x.participantId === +participant.participantId).pos;
  }

  /**
   * Toggle whether the player won a playoff or not
   * @param checkbox Match checkbox changed
   * @param score Score
   */
  onPlayoffToggle(checkbox: MatCheckbox, score: Score) {
    const wonPlayoff = checkbox.checked === true ? '1' : '0';
    this.subscriptions.push(this.scoreService.updatePlayoffWinner(score.scoreId, wonPlayoff).subscribe(response => {
      if (response.status === 200) {
        score.wonPlayoff = wonPlayoff;
      }
    }));
  }

  

}

interface Problem {
  participant: EventParticipant;
  holeScores: HoleScore[]
}

interface Results {
  participants: Participant[],
  eventScores: EventScore[];
}

interface Participant {
  participantId: number,
  members: any[],
  holesComplete: number,
  finalScore: number,
  pos: any
}

export interface EventScore {
  eventId: number,
  name: string,
  eventDate: any,
  courseName: string,
  courseShortName: string,
  scores: Score[]
}

interface Score {
  participantId: number,
  teamMembers: any[],
  scoreId: number,
  holeScores: HoleScore[],
  frontScore: number,
  backScore: number,
  total: number,
  holesComplete: number,
  wonPlayoff: string
}
