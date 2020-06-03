import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Service to handle requests related to Doggies, a special winner in an event for slammer tour.
 * Anyone can get the doggies but only OC, doggie master, or admins should be able to set/change them.
 * 
 * @author Malcolm Roy
 */
@Injectable({
  providedIn: 'root'
})
export class DoggieService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
    ) { }

  getDoggieWinners(eventId: string) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/doggie-winners/get-all/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  add(eventId: number, slammerId: number, distance: any, hole: number) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/doggie-winners/add/index.php';
    return this.http.post<any>(URL, { eventId, slammerId, distance, hole }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  update(id, slammerId, distance, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/doggie-winners/update/index.php';
    return this.http.patch<any>(URL, { id, slammerId, distance, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  delete(id: string, eventId: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('id', id).set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/doggie-winners/delete/index.php';
    return this.http.delete<any>(URL, { params,  headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
