import { Component, OnInit, Input } from '@angular/core';
import { Group } from '../models/Group';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Hole } from '../models/Hole';
import { GroupParticipant } from '../models/GroupParticipant';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @Input() group: Group;
  @Input() scorecard: Scorecard;
  @Input() event: Event;

  constructor() { }

  ngOnInit(): void {
  }

  getHoleScore(participant: GroupParticipant, hole: Hole) {
    return null;
  }

}
