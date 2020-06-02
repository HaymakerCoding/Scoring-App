import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SlammerEventService } from '../services/slammer-event.service';
import { Subscription } from 'rxjs';
import { Par } from '../models/Par';
import { SlammerEvent } from '../models/SlammerEvent';
import { MatTableDataSource } from '@angular/material';
import { Group, Score } from '../models/Group';

@Component({
  selector: 'app-all-scores',
  templateUrl: './all-scores.component.html',
  styleUrls: ['./all-scores.component.scss']
})
export class AllScoresComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  loadingPercentage: number;
  event: SlammerEvent;
  pars: Par[];
  groups: Group[] = [];
  allScores: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: SlammerEventService
  ) { }

  ngOnInit() {
    this.loadingPercentage = 0;
    this.getId();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Get the event ID from router params
   */
  getId() {
    this.activatedRoute.params.subscribe((params: { id: string }) => {
      this.getEvent(params.id);
    });
  }

  /**
   * Get all data for the event selected
   * @param id Event ID
   */
  getEvent(id: string) {
    this.subscriptions.push(this.eventService.get(id).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 20;
        this.event = response.payload;
      } else {
        console.error(response);
      }
      this.getGroupNumbers(id);
    }));
  }

  getGroupNumbers(id) {
    this.subscriptions.push(this.eventService.getGroupNumbers(id).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 40;
        this.event.groupNumbers = response.payload;
      } else {
        console.error(response);
      }
      this.getPars();
    }));
  }

  /**
   * Get the pars for the course
   */
  getPars() {
    this.subscriptions.push(this.eventService.getPars(this.event.courseId.toString()).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 60;
        this.pars = response.payload;
      } else {
        console.error(response);
      }
      if (this.event.groupNumbers.length > 0) {
        this.getGroups();
      } else {
        this.loadingPercentage = 100;
      }
    }));
  }

  /**
   * Get all groups in the event
   */
  getGroups() {
    // get all groups and scores here
    this.subscriptions.push(this.eventService.getAllGroups(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.groups = response.payload;
        this.loadingPercentage = 80;
        this.getAllScores();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get ALL scores for ALL groups for the event
   */
  getAllScores() {
    this.subscriptions.push(this.eventService.getAllEventScores(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.allScores = response.payload;
        this.loadingPercentage = 100;
      } else {
        console.error(response);
      }
    }));
  }

  getHoleScore(slammerId, hole) {
    const playerScores = this.allScores.find(x => +x.slammerId === +slammerId);
    if (playerScores && playerScores.scores) {
      hole = playerScores.scores.find(x => x.hole === hole);
      return hole ? hole.score : 0;
    } else {
      return 0;
    }
  }

  getTotalPars() {
    let total = 0;
    this.pars.forEach(x => total += +x.par);
    return total;
  }

  getPlayerTotal(slammerId) {
    const playerScores = this.allScores.find(x => +x.slammerId === +slammerId);
    let total = 0;
    if (playerScores && playerScores.scores) {
      playerScores.scores.forEach(x => {
        total += +x.score;
      });
    }
    return total;
  }


}
