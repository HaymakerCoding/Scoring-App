import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { Season } from '../models/Season';
import { ScoringType } from '../main/main.component';
import { EventParticipant } from '../models/EventParticipant';

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
   * Ideally we will make all Events generic, but for now some are slammer specific. Here we grab the events that are generic.
   * Using the Slammer Event service as this service should be refactored eventually to just be an event service
   * Get upcoming events from the date passed in. Maxed to the number max number provided.
   */
  getNonSlammerEvents(date: string, maxNum: string){
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('date', date).set('maxNum', maxNum);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/get-upcoming-for-user/index.php',
    { params, headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Get a current tournament season.
   * @param eventTypeId PK for the event type
   * @param year 4 digit year
   */
  getSeason(eventTypeId: string, year: string) {
    const params = new HttpParams().set('eventTypeId', eventTypeId).set('year', year);
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

  getParticipantsByDivision(eventId: string, competitionId: string, type: ScoringType) {
    const params = new HttpParams().set('eventId', eventId).set('competitionId', competitionId).set('type', type);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/participant/get-all-by-division/index.php',
    { params }).pipe(map(response => {
      return response;
    }));
  }

   /**
   * If the user doesn't have a score record yet we initialize 1 for them to be tied to their group participant record
   * UPDATE AN ARRAY OF THEM
   * @param participant Group participant
   */
  initMultipleScores(participants: EventParticipant[], scorecardId: number, teeblockId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/init-multiple-scores/index.php',
    { participants, scorecardId, teeblockId }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * 'Admin' scoring, by password verification on event password
   * @param participant 
   * @param password 
   */
  saveParticipantScoreByPassword(participant: EventParticipant, password: string, eventId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/save-participant-scores-by-password/index.php',
    { participant, password, eventId }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

   /**
   * 'Admin' scoring, set a participants scores as 'official' toggled true of false
   * @param participant Group Participant
   * @param password Password entered to verify user's right to do this on this event
   */
  makeScoresOfficial(participant: EventParticipant, password: string, eventId: number, official: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.patch<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/make-scores-official/index.php',
    { participant, password, eventId, official }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  deleteHoleScoreByPassword(id: string, password: string, eventId: string) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/delete-hole-score-by-password/index.php',
    { id, password, eventId }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }
  

}
