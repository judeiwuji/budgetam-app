import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, of, switchMap } from 'rxjs';
import { SignupResponse } from '../models/Signup';
import { LinkManager } from '../models/LinkManager';
import { LoginRequest, LoginResponse } from '../models/Login';
import User from '../models/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private store = 'users';
  private api = LinkManager.baseUrl + '/api';

  constructor(
    private readonly http: HttpClient,
    private readonly dbService: NgxIndexedDBService,
    private readonly authService: AuthService
  ) {}

  /**
   * @description returns current logged in user
   */
  getCurrentUser() {
    if (this.authService.isGuest()) {
      return this.getGuestUser();
    }

    return this.http.get<User>(`${this.api}/profile`);
  }

  signup(user: User) {
    return this.http.post<SignupResponse>(`${this.api}/signup`, user);
  }

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.api}/login`, request);
  }

  logout() {
    if (this.authService.isGuest()) {
      return of(true);
    }
    return this.http.get<any>(`${this.api}/logout`);
  }

  updateAccount(user: User) {
    if (this.authService.isGuest()) {
      return this.updateGuest(user);
    }

    return this.http.put<boolean>(this.api, user);
  }

  uploadAvatar(user: User, image: File) {
    if (this.authService.isGuest()) {
      return this.updateGuest(user);
    }

    const formData = new FormData();
    formData.append('avatar', image);
    return this.http.post<boolean>(this.api, formData);
  }

  createGuestUser() {
    const guest = new User('guest');
    return this.dbService
      .add<User>(this.store, guest)
      .pipe(switchMap((id) => this.dbService.getByID<User>(this.store, id)));
  }

  private getGuestUser() {
    const userID = this.authService.getToken().split('|')[2];
    return this.dbService.getByID<User>(this.store, parseInt(userID));
  }

  private updateGuest(user: User) {
    return this.dbService
      .update<User>(this.store, user)
      .pipe(map((users) => !!users));
  }
}
