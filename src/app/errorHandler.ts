import { Router } from '@angular/router';

/**
 * Check for and handle errors from Http requests
 * @author Malcolm Roy
 */
export class HttpErrorHandler {

    constructor(
        private router: Router
    ) {
    }

    check(status: number, payload: any) {
        if (this.isError(status, payload) === true) {
            this.handleError(status, payload);
        }
    }

    
    isError(status: number, payload: any) {
        if (status === 200 || status === 201) {
            return false;
        } else {
            return true;
        }
    }

    handleError(status: number, payload: any) {
        console.error(payload);
        if (status === 401 || status === 403) {
            this.router.navigate(['/login']);
        } else {
            this.router.navigate(['/error']);
        }
    }
}