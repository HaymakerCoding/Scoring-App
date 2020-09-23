import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ScoringType } from '../main/main.component';
import { Score } from '../models/SlammerGroup';
import { EventParticipant } from '../models/EventParticipant';

export abstract class Service {

  protected _ApiBaseUrl = 'https://api.clubeg.golf/';
  protected authHeader;

  constructor(
    protected http: HttpClient,
    protected authService: AuthService
    
  ) {
    this.authHeader = this.authService.getAuthHeader();
   }

  

}
