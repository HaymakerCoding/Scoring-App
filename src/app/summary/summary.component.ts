import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../models/Group';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Hole } from '../models/Hole';
import { GroupParticipant } from '../models/GroupParticipant';
import { HoleScore } from '../models/HoleScore';
import { GroupService } from '../services/group.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  @Input() scorecard: Scorecard;
  @Input() event: Event;
  group: Group;

  constructor(
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    this.group = this.groupService.getGroup();
  }

  /**
   * Get score on current hole for a participant
   * @param participant Group participant
   */
  getHoleScore(participant: GroupParticipant, hole: number): number {
    const holeScore: HoleScore = participant.holeScores.find(x => +x.hole === +hole);
    return holeScore ? holeScore.score : 0;
  }

}
