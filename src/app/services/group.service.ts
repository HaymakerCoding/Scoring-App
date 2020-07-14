import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getUsersGroup(eventId: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('eventId', eventId)
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/get-users-group/index.php',
    { params, headers }).pipe(map(response => {
      return response;
    }));
  }

}
