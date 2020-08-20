import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Group } from '../models/Group';
import { GroupParticipant } from '../models/GroupParticipant';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Hole } from '../models/Hole';
import { HoleScore } from '../models/HoleScore';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from '../services/group.service';
import { ScoringType } from '../main/main.component';

@Component({
  selector: 'app-hole-by-hole',
  templateUrl: './hole-by-hole.component.html',
  styleUrls: ['./hole-by-hole.component.scss']
})
export class HoleByHoleComponent implements OnInit, OnDestroy {

  @Input() scorecard: Scorecard;
  @Input() event: Event;
  @Input() scoringType: ScoringType;
  subscriptions: Subscription[] = [];
  holes: number[] = [];
  selectedHole: number;
  group: Group;
  
  
  constructor(
    private groupService: GroupService,
    private router: Router,
    private snackbar: MatSnackBar,
    private changeDetection: ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    console.log(this.scorecard);
    this.scorecard.scorecardHoles.forEach(h => {
      this.holes.push(+h.no);
    });
    this.selectedHole = this.groupService.getCurrentHole();
    if (!this.selectedHole) {
      this.selectedHole = 1;
    }
    this.group = this.groupService.getGroup();
    this.initDefaultScores();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onHoleChange() {
    this.initDefaultScores();
    this.groupService.setCurrentHole(this.selectedHole);

  }

  hasPersistedScores() {
    let scoresPersisted = true;
    this.group.groupParticipants.forEach(participant => {
      const holeScore = participant.holeScores.find(x => +x.hole === +this.selectedHole);
      if (!holeScore || !holeScore.id) {
        scoresPersisted = false;
      }
    });
    return scoresPersisted;
  }

  /**
   * Check all group participants for a score for this hole.
   * If no score yet, set the default score to the par for this hole.
   */
  initDefaultScores() {
    this.group.groupParticipants.forEach(participant => {
      const holeScore = participant.holeScores.find(x => +x.hole === +this.selectedHole);
      if (!holeScore) {
        participant.holeScores.push(new HoleScore(null, participant.scoreId, this.getTeeBlockHoleId(this.selectedHole, participant.teeBlock1id), this.selectedHole, +this.getPar(this.selectedHole), 0, false));
      }
    });
  }

  /**
   * ISSSUE !!!!!H ERE!!!!!!!
   * @param holeNum 
   * @param teeBlockId 
   */
  getTeeBlockHoleId(holeNum: number, teeBlockId: number) {
    if (!teeBlockId) {
      teeBlockId = this.getDefaultTeeBlockId();
    }
    const scorecardHoles = this.scorecard.scorecardHoles.find(x => +x.no === +holeNum)
    let teeBlockHole = scorecardHoles.teeBlockHoles.find(block => +block.teeBlockId === +teeBlockId);
    if (!teeBlockHole) {
      console.error('Error getting the tee block hole id');
    } else {
      return teeBlockHole.id;
    }
  }

   /**
   * Temporary, get the teeblock id from a teeblock set on the first array of teeblocks from the scorecard.
   * This is just for when we don't care about teeblocks. For real teeblock use we need to pull the members assigned tee block id.
   * Either way, the scorecard for the course NEEDS to have the teeblock set
   */
  getDefaultTeeBlockId() {
    const defaultTeeBlockId = this.scorecard.scorecardHoles[0].teeBlockHoles[0].teeBlockId;
    if (defaultTeeBlockId) {
      return defaultTeeBlockId;
    } else {
      console.error('Error, no default tee block found on the scorecard');
    }
  }

  /**
   * Change the score on current hole for a group participant
   * Set min 1 and max 8
   * @param participant Group participant
   * @param value value to adjust score by
   */
  changeScore(participant: GroupParticipant, value: number) {
    let holeScore: HoleScore;
    holeScore = participant.holeScores.find(x => +x.hole === +this.selectedHole);
    if (!holeScore) {
      holeScore = new HoleScore(null, participant.scoreId, null, this.selectedHole, +this.getPar(this.selectedHole), 0, false);
      holeScore.score += +value;
      participant.holeScores.push(holeScore);
    } else {
      holeScore.score = +holeScore.score + +value;
    }
    if (holeScore.score < 1) {
      holeScore.score = 1;
    } else if (holeScore.score > 8) {
      holeScore.score = 8;
    }
  }

  /**
   * Get score on current hole for a participant
   * @param participant Group participant
   */
  getHoleScore(participant: GroupParticipant, hole: number): number {
    const holeScore : HoleScore = participant.holeScores.find(x => +x.hole === +hole);
    return holeScore ? holeScore.score : this.getPar(hole);
  }

  /**
   * Get the par for a hole
   * @param hole Hole we need a par for
   */
  getPar(hole: number): number {
    let scorecardHole: Hole;
    scorecardHole = this.scorecard.scorecardHoles.find(x => +x.no === +hole);
    return scorecardHole ? +scorecardHole.par : null;
  }

  /**
   * Send the group to the server to update scores for all participants in it
   */
  submitGroupScores() {
    this.subscriptions.push(this.groupService.saveGroupScores(this.group).subscribe(response => {
      if (response.status === 200) {
        this.snackbar.open('Scores saved!', '', { duration: 1000 });
        this.group = response.payload;
        this.group.groupParticipants.forEach(participant => {
          participant.holeScores.forEach(x => {
            x.persisted = true;
          });
        });
        this.groupService.setGroup(this.group);
        this.goToNextHole();
        console.log(this.group);
        this.changeDetection.detectChanges();
      } else if (response.status === 401 || response.status === 403) {
        this.router.navigate(['/login']);
      } else {
        console.error(response);
      }
    }));
  }

  goToNextHole() {
    if (this.selectedHole < 18) {
      this.selectedHole += 1;
    }
    this.onHoleChange();
  }

  /**
   * Get a players par result up to the current hole
   * Take the target par for all holes up to this hole and compare to users score up to this point.
   * @param participant Group participant
   */
  getPlayersResult(participant: GroupParticipant): number | string {
    let parTarget = 0;
    let userPar = 0;
    for (let x = 1; x <= this.selectedHole; x++) {
      parTarget += +this.getPar(x);
      userPar += +this.getHoleScore(participant, x);
    }
    const result = userPar - parTarget;
    return result !== 0 ? result : 'Even';

  }

  loginAdmin(password: string) {
    alert(password);
  }

  /**
   * Check if the participants scores are flagged as official
   * @param participant Group Participant
   */
  hasOfficialScores(participant: GroupParticipant) {
    let offical = true;
    participant.holeScores.forEach(x => {
      if (+x.official === 0) {
        offical = false;
      }
    });
    return offical;
  }



}

