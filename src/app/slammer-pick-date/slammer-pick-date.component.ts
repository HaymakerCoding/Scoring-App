import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SlammerEventService } from '../services/slammer-event.service';
import { EventBasic } from '../models/EventBasic';
import { Router } from '@angular/router';

/**
 * User date selection screen.
 * After Login user gets this screen to choose an events.
 * Events show only if user is registred and grouped for the event.
 *
 * @author Malcolm Roy
 */
@Component({
  selector: 'app-slammer-pick-date',
  templateUrl: './slammer-pick-date.component.html',
  styleUrls: ['./slammer-pick-date.component.scss']
})
export class SlammerPickDateComponent implements OnInit, OnDestroy {

  @ViewChild('pickerBtn') pickerBtn: ElementRef;
  subscriptions: Subscription[] = [];
  loadingPercent: number;
  todaySlammerEvents: EventBasic[] = [];
  tomorrowSlammerEvents: EventBasic[] = [];
  todayEvents: EventBasic[];
  tomorrowEvents: EventBasic[];

  today: Date;
  tomorrow: Date;

  constructor(
    private slammerEventService: SlammerEventService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadingPercent = 0;
    this.today = new Date(new Date().toDateString());
    this.tomorrow = new Date(new Date().toDateString());
    this.tomorrow.setDate(this.tomorrow.getDate() + 1); // DEBUG line to change dates
    this.getSlammerEvents(this.today, 'today');
    this.getSlammerEvents(this.tomorrow, 'tomorrow');
    this.getNonSlammerEvents(this.today, 'today');
    this.getNonSlammerEvents(this.tomorrow, 'tomorrow');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setLoadingPercent(percent: number) {
    this.loadingPercent += percent;
  }

  /**
   * Return a MySQL formatted date string
   * @param year Year number
   * @param month Month number
   * @param day Day number
   */
  getMysqlDate(date: Date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    return year + '-' + month + '-' + day;
  }

  /**
   * Get the events for that day from the database
   * @param date MySQL date format
   */
  getSlammerEvents(date, day: string) {
    const mysqlDate = this.getMysqlDate(date);
    this.subscriptions.push(this.slammerEventService.getEventsForDay(mysqlDate.toString()).subscribe(response => {
      if (response.status === 200) {
        if (day === 'today') {
          this.todaySlammerEvents = response.payload;
        } else {
          this.todaySlammerEvents = response.payload;
        }
        this.setLoadingPercent(25);
      } else {
        console.error(response);
      }
    }));
  }

  getNonSlammerEvents(date, day: string) {
    const mysqlDate = this.getMysqlDate(date);
    this.subscriptions.push(this.slammerEventService.getNonSlammerEvents(mysqlDate).subscribe(response => {
      if (response.status === 200) {
        if (day === 'today') {
          this.todayEvents = response.payload;
        } else {
          this.tomorrowEvents = response.payload;
        }
        console.log(response);
        this.setLoadingPercent(25);
      } else {
        console.error(response);
      }
    }));
    
  }

  /**
   * User selected a Slammer Tour event, allow enter scores if day of event
   * @param event Event
   */
  onSlammerEventSelected(event: EventBasic) {
    // turn mysql date into a javasript Date
    const dateParts = event.date.split('-');
    const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
    // compare dates to ensure scoring is done on the day of event
    if (eventDate < this.today || eventDate > this.today) {
      this.snackbar.open('Sorry scoring is only allowed on the day of the event.', 'Got it!');
    } else {
      this.router.navigate(['/slammer-tour/scoring/' + event.id]);
    }
  }

  /**
   * User selected a tournament or other event. go to specific routing for the specific tournament
   * @param event 
   */
  onEventSelected(event: EventBasic) {
    // turn mysql date into a javasript Date
    const dateParts = event.eventDate.split('-');
    const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
    // compare dates to ensure scoring is done on the day of event
    if (eventDate < this.today || eventDate > this.today) {
      this.snackbar.open('Sorry scoring is only allowed on the day of the event.', 'Got it!');
    } else {
      switch(+event.eventTypeId) {
        case 10: {
          //Commish's Cup
          alert('Commishs Cup!');
        }
        default: {
          this.snackbar.open('Sorry scoring not available for this event type yet.', 'Got it!');
        }
      }
      
    }
  }



}
