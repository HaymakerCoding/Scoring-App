import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepicker, MatSnackBar } from '@angular/material';
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
export class SlammerPickDateComponent implements OnInit {

  @ViewChild('pickerBtn', { static: false }) pickerBtn: ElementRef;
  subscriptions: Subscription[] = [];
  loading: boolean;
  todayEvents: EventBasic[] = [];
  tomorrowEvents: EventBasic[] = [];
  today: Date;
  tomorrow: Date;

  constructor(
    private slammerEventService: SlammerEventService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loading = true;
    this.today = new Date(new Date().toDateString());
    this.tomorrow = new Date(new Date().toDateString());
    this.tomorrow.setDate(this.tomorrow.getDate() + 1); // DEBUG line to change dates
    this.getTodayEvents();

  }

  /**
   * When a new date is selected. Format the date from Date Picker then fetch events for that date
   * @param date Date Obj from picker
   */
  /* DEPRICATED
  onDaySelected(date) {
    const year = date._i.year;
    const month = date._i.month + 1;
    const day = date._i.date;
    const mysqlDate = this.getMysqlDate(year, month, day);
    this.getDayEvents(mysqlDate);
  }
  *

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

  getDate(offset) {

  }

  /**
   * Get the events for that day from the database
   * @param date MySQL date format
   */
  getTodayEvents() {
    const date = this.getMysqlDate(this.today);
    this.subscriptions.push(this.slammerEventService.getEventsForDay(date.toString()).subscribe(response => {
      if (response.status === 200) {
        this.todayEvents = response.payload;
      } else {
        console.error(response);
      }
      this.getTomorrowEvents();
    }));
  }

  getTomorrowEvents() {
    const date = this.getMysqlDate(this.tomorrow);
    this.subscriptions.push(this.slammerEventService.getEventsForDay(date.toString()).subscribe(response => {
      if (response.status === 200) {
        this.tomorrowEvents = response.payload;
      } else {
        console.error(response);
      }
      this.loading = false;
    }));
  }

  /**
   * User selected event, allow enter scores if day of event
   * @param event Event
   */
  onEventSelected(event: EventBasic) {
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



}
