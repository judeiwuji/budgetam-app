import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import User from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly dbService: NgxIndexedDBService) {}

  createGuestUser() {
    return this.dbService.add<User>('users', new User('guest'));
  }
}
