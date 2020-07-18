import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Season } from '../models/Season';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get(id: string) {
    const params = new HttpParams().set('id', id)
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/get/index.php',
    { params }).pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get the scorecard for the event
   * @param id Scorecard ID
   */
  getScorecard(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/courses/scorecard/get/index.php',
    { params }).pipe(map(response => {
      return response;
    }));
  }

  getAllDivisions(tournamentId: string) {
    const params = new HttpParams().set('tournamentId', tournamentId);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/tournaments/divisions/get-all/index.php',
      { params })
      .pipe(map(response => {
        return response;
    }));
  }
   
  /**
   * Get all tournament events by a tournament year record id
   * @param yearId Tournament Year ID
   */
  getAllEvents(season: Season) {
    const params = new HttpParams().set('seasonId', season.id.toString())
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/get-all/index.php',
    { params }).pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get a current tournament season.
   * @param tournamentId 
   * @param year 
   */
  getSeason(tournamentId: string, year: string) {
    const params = new HttpParams().set('tournamentId', tournamentId).set('year', year);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/season/get/index.php',
    { params }).pipe(map(response => {
      return response;
    }));
  }

  verifyEventPassword(eventId, password) {
    const headers = this.authService.getAuthHeader();
      return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/verify-event-password/index.php',
      { eventId, password }, { headers }).pipe(map(response => {
        return response;
      }));
  }
  

}
