import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Service } from './service.ts';

@Injectable({
  providedIn: 'root'
})
export class TournamentService extends Service {

  constructor(
    protected http: HttpClient,
    protected authService: AuthService
  ) {
    super(http, authService);
   }

   /**
    * Get all tournaments, basic info for list
    */
   getAll() {
    return this.http.get<any>(this._ApiBaseUrl + 'tournaments');
  }
  
}
