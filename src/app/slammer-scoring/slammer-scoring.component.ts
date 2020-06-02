import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SlammerEventService } from '../services/slammer-event.service';
import { SlammerEvent } from '../models/SlammerEvent';
import { Par } from '../models/Par';

@Component({
  selector: 'app-slammer-scoring',
  templateUrl: './slammer-scoring.component.html',
  styleUrls: ['./slammer-scoring.component.scss']
})
export class SlammerScoringComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  loading: boolean;
  event: SlammerEvent;
  loadingPercentage: number;
  pars: Par[];
  currentView: View;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: SlammerEventService
  ) { }

  ngOnInit() {
    this.loadingPercentage = 0;
    this.loading = true;
    this.getId();
    this.currentView = View.ALL;
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
        this.loadingPercentage = 30;
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
        this.loadingPercentage = 60;
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
    this.subscriptions.push(this.eventService.getPars(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.loadingPercentage = 100;
        this.pars = response.payload;
      } else {
        console.error(response);
      }
    }));
  }

}

enum View {
  ALL = 'all',
  GROUP = 'group'
}
