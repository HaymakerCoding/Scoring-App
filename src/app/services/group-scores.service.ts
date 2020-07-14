
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';
import { SlammerGroup } from '../models/SlammerGroup';
import { GroupParticipant } from '../models/GroupParticipant';
import { Group } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class GroupScoresService {

  private unsavedScores = new Subject<boolean>();
  private group: SlammerGroup;
  private eventId: number;
  private holeOn: number;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.setUnsavedScores(false);
   }

  setUnsavedScores(unsavedScores: boolean) {
    this.unsavedScores.next(unsavedScores);
  }

  setHoleOn(hole: number) {
    this.holeOn = hole;
  }

  getHoleOn() {
    return this.holeOn;
  }

  hasUnsavedScores() {
    return this.unsavedScores;
  }

  setGroup(group: SlammerGroup) {
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
   * Submit Scores for a group. This is SLAMMER TOUR SPECIFIC
   * @param group Golf group made up of up to 4 players and their scores
   */
  submitScores() {
    const group: SlammerGroup = this.getGroup();
    const eventId = this.getEventId();
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/scores/submit-group-scores/index.php',
    { eventId, group }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * If the user doesn't have a score record yet we initialize 1 for them to be tied to their group participant record
   * @param participant Group participant
   */
  initScore(participant: GroupParticipant, scorecardId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/init-score/index.php',
    { participant, scorecardId }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Save all the score for a group. Updates or adds as needed. This is for ALL events!
   * @param group 
   */
  saveGroupScores(group: Group) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/save-group-scores/init-score/index.php',
    { group }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }
}
