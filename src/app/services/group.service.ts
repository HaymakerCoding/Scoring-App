import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { GroupParticipant } from '../models/GroupParticipant';
import { Group } from '../models/Group';

/**
 * Service to handle the user's group actions.
 * We store the current group here for child components to access same instance.
 * 
 * @author Malcolm Roy
 */
@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private group: Group;
  private currentHole: number;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getGroup(): Group {
    return this.group;
  }

  setGroup(group: Group){
    this.group = group;
  }

  setCurrentHole(hole: number) {
    this.currentHole = hole;
  }

  getCurrentHole(): number {
    return this.currentHole;
  }

  getUsersGroup(eventId: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('eventId', eventId)
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/get-users-group/index.php',
    { params, headers }).pipe(map(response => {
      return response;
    }));
  }

  getAll(eventId: string, tournamentId: string) {
    const params = new HttpParams().set('eventId', eventId).set('tournamentId', tournamentId);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/get-all/index.php',
    { params }).pipe(map(response => {
      return response;
    }));
  }

  /**
   * If the user doesn't have a score record yet we initialize 1 for them to be tied to their group participant record
   * @param participant Group participant
   */
  initScore(participant: GroupParticipant, scorecardId: number, teeblockId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/init-score/index.php',
    { participant, scorecardId, teeblockId }, { headers })
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
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/save-group-scores/index.php',
    { group }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }
  
  /**
   * 'Admin' scoring, by password verification on event password
   * @param participant 
   * @param password 
   */
  saveParticipantScoreByPassword(participant: GroupParticipant, password: string, eventId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/save-participant-scores-by-password/index.php',
    { participant, password, eventId }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * 'Admin' scoring, set a participants scores as 'official'
   * @param participant Group Participant
   * @param password Password entered to verify user's right to do this on this event
   */
  makeScoresOfficial(participant: GroupParticipant, password: string, eventId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.patch<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/score/make-scores-official/index.php',
    { participant, password, eventId }, { headers })
    .pipe(map(response => {
      return response;
    }));
  }

}
