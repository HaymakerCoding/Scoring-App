import { Component, OnInit, Input } from '@angular/core';
import { Scorecard } from '../models/Scorecard';
import { Event } from '../models/Event';
import { Group } from '../models/Group';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  
  @Input() group: Group;
  @Input() scorecard: Scorecard;
  @Input() event: Event;

  constructor() { }

  ngOnInit(): void {
  }

}
