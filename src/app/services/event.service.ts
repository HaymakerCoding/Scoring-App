import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

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

    

  

}
