import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, of, switchMap } from 'rxjs';
import { SignupResponse } from '../models/Signup';
import { LinkManager } from '../models/LinkManager';
import { LoginRequest, LoginResponse } from '../models/Login';
import User from '../models/User';
import { AuthService } from './auth.service';
import { ChangePasswordRequest } from '../models/ChangePassword';
import { VerifyUserRequest } from '../models/ResetPassword';
import Feedback from '../models/Feedback';

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
      return this.updateGuest(user).pipe(
        map(() => ({ image: user.avatar as string }))
      );
    }

    const formData = new FormData();
    formData.append('avatar', image);
    return this.http.post<{ image: string }>(`${this.api}/avatar`, formData);
  }

  changePassword(request: ChangePasswordRequest) {
    if (this.authService.isGuest()) {
      const response = new Feedback();
      response.message = 'Feature only available to real users';
      response.success = false;
      return of(response);
    }
    return this.http.post<Feedback>(`${this.api}/change_password`, request);
  }

  resetPassword(password: string, token: string) {
    if (this.authService.isGuest()) {
      const response = new Feedback();
      response.message = 'Feature only available to real users';
      response.success = false;
      return of(response);
    }
    return this.http.post<Feedback>(`${this.api}/verify/${token}`, {
      password,
    });
  }

  verifyUser(request: VerifyUserRequest) {
    if (this.authService.isGuest()) {
      const response = new Feedback();
      response.message = 'Feature only available to real users';
      response.success = false;
      return of(response);
    }
    return this.http.post<Feedback>(`${this.api}/forgotten_password`, request);
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
