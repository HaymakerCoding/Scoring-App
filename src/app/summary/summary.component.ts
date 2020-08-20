import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../models/Group';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Hole } from '../models/Hole';
import { GroupParticipant } from '../models/GroupParticipant';
import { HoleScore } from '../models/HoleScore';
import { GroupService } from '../services/group.service';
import { MatTableDataSource } from '@angular/material/table';
import { ScoringType } from '../main/main.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  @Input() scorecard: Scorecard;
  @Input() event: Event;
  @Input() scoringType: ScoringType;
  group: Group;
  holeColumns = [];
  parColumns = [];
  dataSource: MatTableDataSource<any>;
  columns: string[] = ['name'];

  constructor(
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.group = this.groupService.getGroup();
    this.holeColumns.push('hole');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.holeColumns.push('h'+hole.no);
    });
    this.parColumns.push('par');
    this.scorecard.scorecardHoles.forEach(hole => {
      this.parColumns.push('p'+hole.no);
      this.columns.push(hole.no.toString());
    });
    this.dataSource = new MatTableDataSource(this.group.groupParticipants);
  }

  /**
   * Get score on current hole for a participant
   * @param participant Group participant
   */
  getHoleScore(participant: GroupParticipant, hole: number): number {
    const holeScore: HoleScore = participant.holeScores.find(x => +x.hole === +hole);
    return holeScore && holeScore.id ? holeScore.score : null;
  }

}
