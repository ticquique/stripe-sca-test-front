import { IUser } from './../../../interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Api } from './api';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class UserService extends Api {

    public _user$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
    public user$: Observable<IUser> = this._user$.asObservable();

    constructor(httpClient: HttpClient, private router: Router, public authService: AuthService) {
        super('user', httpClient);
        this.authService.currentUserId$.pipe(
            switchMap(id => this.getUser(id)),
        ).subscribe(val => {
          this._user$.next(val);
          if (val === null) { this.router.navigate(['/login']); }
        });
    }

    getUsers(params?: [string, any][]): Observable<IUser[]> {
        return this.authService.currentUserId$.pipe(
            switchMap(user => user !== null ? this.getAll(null, params) : of(null))
        );
    }

    getUser(id: string, params?: [string, any][]): Observable<IUser> {
        return this.authService.currentUserId$.pipe(
            switchMap(user => user !== null ? this.get(id, null, params) : of(null))
        );
    }

}
