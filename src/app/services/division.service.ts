import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  private usersDivision: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  setUsersDivision(division) {
    this.usersDivision = division;
  }

  getUsersDivision() {
    return this.usersDivision;
  }

  getUsersDivisionFromServer(eventId: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('eventId', eventId)
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/get-users-division/index.php',
    { params, headers }).pipe(map(response => {
      return response;
    }));
  }

  getAllGroupsInDivision(eventTypeId: string, eventId: string, divisionId: string) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('eventTypeId', eventTypeId).set('eventId', eventId).set('divisionId', divisionId);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/event/group/get-by-division/index.php',
    { params, headers }).pipe(map(response => {
      return response;
    }));
  }
}
