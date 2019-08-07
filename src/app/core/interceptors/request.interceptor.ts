import { Router, RouterStateSnapshot } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, timeout, retry, switchMap, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // To update request headers
        request = request.clone({ setHeaders: {} });
        // Manage request once thrown
        return this.processRequest(request, next);
    }

    processRequest(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
            timeout(1000000),
            retry(2),
            catchError(err => {
                if (err.status !== 200) {
                    this.authenticationService.logout();
                    // this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url }});
                }
                const error = err.error ? err.error.message ? err.error.message : err.message : err.statusText || err.message;
                return throwError(error);
            })
        );
    }
}
