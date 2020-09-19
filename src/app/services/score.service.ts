import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ScoringType } from '../main/main.component';
import { Score } from '../models/SlammerGroup';
import { EventParticipant } from '../models/EventParticipant';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private _ApiBaseUrl = 'https://api.clubeg.golf/';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get scores for multiple events, by team or individual
   * @param eventIds Ids of events to obtain scores for
   * @param scoringType Team or Individidual flag
   */
  getScores(eventIds: string[], scoringType: ScoringType, competitionId: string) {
    const params = new HttpParams({
      fromObject: { 'eventIds[]' : eventIds, 'scoringType': scoringType, 'competitionId': competitionId }
    });
    return this.http.get<any>(this._ApiBaseUrl + 'scores', { params });
  }

  /**
   * Set the playoff winner flag, toggle between 1 or 0 to indicate if the player is the winner of a playoff match. Used to sort ties
   */
  updatePlayoffWinner(scoreId: number, wonPlayoff: string) {
    const headers = this.authService.getAuthHeader();
    return this.http.patch<any>(this._ApiBaseUrl + 'score-won-playoff', { scoreId, wonPlayoff }, { headers })
  }

  /**
   * 'Admin' scoring, by password verification on event password
   * @param participant 
   * @param password 
   */
  saveParticipantScoreByPassword(participant: EventParticipant, password: string, eventId: number) {
    const headers = this.authService.getAuthHeader();
    return this.http.post<any>(this._ApiBaseUrl + 'hole-scores',
    { participant, password, eventId }, { headers });
  }

}
