import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all quotes for an event, 3 types: quotes, notables, feedback
   */
  getAllQuotes(eventId: number) {
    const params = new HttpParams().set('eventId', eventId.toString());
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/quotes/get-all-for-event/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  add(eventId: number, playerId, type, text, slammer) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/quotes/add/index.php';
    return this.http.post<any>(URL, { eventId, playerId, type, text, slammer }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  delete(id, eventId: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('id', id).set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/quotes/delete/index.php';
    return this.http.delete<any>(URL, { params, headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Update a quotable/notable/ or feedback for this event by it's ID.
   * @param id PK
   * @param playerId Players Slammer ID
   * @param type number indicating type of quote
   * @param text Quote text
   * @param slammer Text name of slammer player (nickname)
   */
  update(id, playerId, type, text, slammer, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/quotes/update/index.php';
    return this.http.patch<any>(URL, { id, playerId, type, text, slammer, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
