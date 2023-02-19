import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import Session from '../models/Session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private AUTH_KEY = 'app-auth-session';

  constructor(
    private dbService: NgxIndexedDBService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  isGuest() {
    const token = this.getToken();
    return (token && token.split('|')[1] === 'guest') || false;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getToken() {
    return this.cookieService.get(this.AUTH_KEY);
  }

  login(token: string) {
    this.logout();
    this.cookieService.set(this.AUTH_KEY, token);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.cookieService.delete(this.AUTH_KEY);
    this.dbService.clear('users').subscribe();
    this.dbService.clear('transactions').subscribe();
    this.dbService.clear('categories').subscribe();
    this.router.navigate(['/login']);
  }
}
