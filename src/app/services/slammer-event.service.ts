import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SlammerGroup } from '../models/SlammerGroup';

@Injectable({
  providedIn: 'root'
})
export class SlammerEventService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get upcomming events for slammer tour, up to a max number
   * FOR the specific user logged in - any events they are grouped in
   * User needs to be logged in as we use token to identify the user
   * @param date Date to fetch events for, in mysql format
   */
  getEvents(date: string, maxNum: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('date', date).set('maxNum', maxNum);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-for-day-and-member/index.php',
    { params, headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get event data and groups for that event
   */
  get(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }

  getGroupNumbers(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-group-numbers/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get a list of pars for the course
   */
  getPars(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/pars/get/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get any scores set for a group the database
   * @param group Golf Group
   */
  getGroupScores(eventId, group: SlammerGroup) {
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-group-scores/index.php',
    { group, eventId })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get all groups for the event
   * @param eventId Event ID
   */
  getAllGroups(eventId: string) {
    const params = new HttpParams().set('id', eventId);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/groups/get-all/index.php',
    { params })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get all scores in the event for all players
   * @param eventId Event ID
   */
  getAllEventScores(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/scores/get-all-for-event/index.php',
    { params })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get all registrations for an event
   * Return just basic info for listing
   */
  getAllRegistered(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/registrations/get-all/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  


}
