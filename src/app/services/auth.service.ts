import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private loggedIn = new Subject();
  private userNames: UserNames;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getUserNames(): UserNames {
    return this.userNames;
  }

  /**
   * Get full name and nickname from the database for the current user
   */
  getUserNamesFromDb() {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken());
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/clubeg/members/get-member-nickname/index.php', { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  getLoggedIn(): Subject<any> {
    return this.loggedIn;
  }
  setLoggedIn(loggedIn: boolean) {
    this.loggedIn.next(loggedIn);
  }

  setToken(token: string) {
    this.token = token;
  }

  /**
   * Return the in memory access token IF there is one, this will be lost on page reloads
   * If no token we need to use a refresh token to get a new access token.
   * If no access token then we send to login
   */
  getToken(): string {
    return this.token;
  }

  getRefreshToken() {
    const token = localStorage.getItem('egRefreshToken');
    return token ? token : null;
  }

  setRefreshToken(token: string) {
    localStorage.setItem('egRefreshToken', token);
  }

  /**
   * Set an authorization header with the user's token to validate requests
   */
  getAuthHeader(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

  /**
   * Use the refresh token to get a new access token from server
   */
  getNewToken() {
    const refreshToken = this.getRefreshToken();
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + refreshToken);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/auth/get-new-token.php', { headers })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Login request. Send to data to server for authentication.
   * @param form Format data
   */
  login(form: any) {
    return this.http.post<any>('https://clubeg.golf/common/api_REST/v1/auth/login-new.php', {
      password: form.password,
      email: form.email
    })
    .pipe(map(response => {
      return response;
    }));
  }

  /**
   * Clear user data and client storage and logout
   */
  logout() {
    this.setToken(null);
    this.setRefreshToken(null);
    this.setLoggedIn(false);
    this.userNames = null;
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}

interface UserNames {
    fullName: string,
    nickname: string
}
