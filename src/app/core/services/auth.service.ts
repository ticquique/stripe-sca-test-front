import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

interface Token {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {

  public currentUserId$ = new BehaviorSubject<string>(null);
  private apiUrl = `${environment.api_url}/${environment.api_version}`;

  constructor(private http: HttpClient) {
    const token = JSON.parse(localStorage.getItem('bnb_user'));
    const currentUserId = token ? this.parseJwt(token) : null;
    if (currentUserId && currentUserId.sub) { this.currentUserId$.next(currentUserId.sub); }
  }

  login(username: string, password: string) {
    return this.http.post<string>(`${this.apiUrl}/auth/`, { username, password })
      .pipe(
        filter(token => token.length > 0),
        tap(token => this.updateToken(token))
      );
  }

  updateToken(token: string) {
    localStorage.setItem('bnb_user', JSON.stringify(token));
    this.currentUserId$.next(this.parseJwt(token).sub);
    return token;
  }

  logout() {
    localStorage.removeItem('bnb_user');
    this.currentUserId$.next(null);
  }

  public parseJwt(token: string): Token {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}
