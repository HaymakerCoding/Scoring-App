import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    .pipe(retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client error
          errorMessage = 'Error: ' + error.error.message;
        } else {
          // server error
          errorMessage = 'Error: ' + error.status + '\n' + error.message;
        }
        localStorage.setItem('error', errorMessage );
        localStorage.setItem('fullError', JSON.stringify(error));
        if (+error.status === 401 || error.status === 403) {
          this.router.navigate(['login']);
        } else {
          this.router.navigate(['error']);
        }
        return throwError(errorMessage);
      })
    );
  }
}
