import { Group } from '../models/Group';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupScoresService {

  private unsavedScores = new Subject<boolean>();
  private group: Group;
  private eventId: number;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.setUnsavedScores(false);
   }

  setUnsavedScores(unsavedScores: boolean) {
    this.unsavedScores.next(unsavedScores);
  }

  hasUnsavedScores() {
    return this.unsavedScores;
  }

  setGroup(group: Group) {
    this.group = group;
  }

  getGroup() {
    return this.group;
  }

  setEventId(eventId) {
    this.eventId = eventId;
  }

  getEventId() {
    return this.eventId;
  }

  /**
   * Get the user's group in the event
   * @param id Event ID
   */
  getMembersGroup(id: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/groups/get-members-group/index.php',
    { params, headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Submit Scores for a group
   * @param group Golf group made up of up to 4 players and their scores
   */
  submitScores() {
    const group: Group = this.getGroup();
    const eventId = this.getEventId();
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/scores/submit-group-scores/index.php',
    { eventId, group }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }
}
