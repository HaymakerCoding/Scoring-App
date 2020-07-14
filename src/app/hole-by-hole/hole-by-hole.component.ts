import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Group } from '../models/Group';
import { GroupParticipant } from '../models/GroupParticipant';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Hole } from '../models/Hole';
import { HoleScore } from '../models/HoleScore';
import { Subscription } from 'rxjs';
import { GroupScoresService } from '../services/group-scores.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hole-by-hole',
  templateUrl: './hole-by-hole.component.html',
  styleUrls: ['./hole-by-hole.component.scss']
})
export class HoleByHoleComponent implements OnInit, OnDestroy {

  @Input() group: Group;
  @Input() scorecard: Scorecard;
  @Input() event: Event;
  subscriptions: Subscription[] = [];
  holes: number[] = [];
  selectedHole: number;
  
  constructor(
    private groupScoreService: GroupScoresService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    for (let x = 1; x < 19; x++) {
      this.holes.push(x);
    }
  }

  ngOnInit(): void {
    this.selectedHole = 1;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      holeScore = new HoleScore(null, participant.scoreId, null, this.selectedHole, this.getPar(this.selectedHole));
      holeScore.score += +value;
      participant.holeScores.push(holeScore);
    } else {
      holeScore.score += +value;
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
    if (hole < 10) {
      scorecardHole = this.scorecard.section1.holes.find(x => +x.no === +hole);
    } else {
      scorecardHole = this.scorecard.section1.holes.find(x => +x.no === +hole);
    }
    return scorecardHole ? +scorecardHole.par : null;
  }

  /**
   * Send the group to the server to update scores for all participants in it
   */
  submitGroupScores() {
    this.subscriptions.push(this.groupScoreService.saveGroupScores(this.group).subscribe(response => {
      if (response.status === 200) {
        this.snackbar.open('Scores saved!', '', { duration: 1000 });
        this.group = response.payload;
        this.goToNextHole();
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
  }

  /**
   * Get a players par result up to the current hole
   * Take the target par for all holes up to this hole and compare to users score up to this point.
   * @param participant Group participant
   */
  getPlayersResult(participant: GroupParticipant) {
    let parTarget = 0;
    let userPar = 0;
    for (let x = 1; x <= this.selectedHole; x++) {
      parTarget += +this.getPar(x);
      userPar += +this.getHoleScore(participant, x);
    }
    return userPar - parTarget;

  }



}
