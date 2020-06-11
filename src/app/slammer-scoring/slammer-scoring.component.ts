import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SlammerEventService } from '../services/slammer-event.service';
import { SlammerEvent } from '../models/SlammerEvent';
import { Par } from '../models/Par';
import { BasicReg } from '../models/BasicReg';
import { DoggieService } from '../services/doggie.service';

/**
 * Main component handling the soring specific for Slammer Tour events.
 * 
 * @author Malcolm Roy
 */
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
  registered: BasicReg[];
  doggieWinners: DoggieWinner[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: SlammerEventService,
    private doggieService: DoggieService
  ) { }

  ngOnInit() {
    this.loadingPercentage = 0;
    this.loading = true;
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
        this.loadingPercentage = 30;
        this.event = response.payload;
      } else {
        console.error(response);
      }
      this.getAllRegistered();
    }));
  }

  /**
   * Get a list of all players registered in the event.
   * Used for getting a full list of available players to assign as doggie winners
   */
  getAllRegistered() {
    this.subscriptions.push(this.eventService.getAllRegistered(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        this.registered = response.payload;
        this.loadingPercentage = 50;
        this.getGroupNumbers(this.event.id.toString());
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Get a list of group numbers for all groups in the event. This number just identifies the group
   * @param id  Event ID, string for http request param
   */
  getGroupNumbers(id: string) {
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
        this.loadingPercentage = 70;
        this.pars = response.payload;
        this.initWinners();
      } else {
        console.error(response);
      }
    }));
  }

  /**
   * Initialize all the POSSIBLE Doggie winners. determined by holes where par is 3.
   */
  initWinners() {
    this.pars.forEach(x => {
      if (x.par <= 3) {
        this.doggieWinners.push(new DoggieWinner(null, x.hole, null, null, null));
      }
    });
    this.getDoggieWinners();
  }

  /**
   * Get any winners set for the doggies
   */
  getDoggieWinners(){
    this.subscriptions.push(this.doggieService.getDoggieWinners(this.event.id.toString()).subscribe(response => {
      if (response.status === 200) {
        const winnerRecords: any[] = response.payload;
        winnerRecords.forEach(x => {
          const winner = this.doggieWinners.find(y => y.hole === +x.hole);
          if (winner) {
            winner.name = x.nickname;
            winner.distance = x.distance;
            winner.slammerId = +x.player;
            winner.id = +x.id;
          }
        });
        this.loadingPercentage = 100;
      } else {
        alert('Error getting the doggie winners');
        console.error(response);
      }
    }));
  }

}

enum View {
  ALL = 'all',
  GROUP = 'group'
}

export class DoggieWinner {
  constructor(
    public id: number,
    public hole: number,
    public name: string,
    public distance: number,
    public slammerId: number
  ) {}
}
