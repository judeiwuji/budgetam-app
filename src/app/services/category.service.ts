import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { categories } from '../config/data/categories';
import Category from '../models/Category';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private API_URL = '';
  constructor(
    private readonly dbService: NgxIndexedDBService,
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) {}

  getCategories() {
    if (this.authService.isGuest()) {
      return this.dbService.getAll<Category>('categories');
    }
    return this.http.get<Category[]>(this.API_URL);
  }

  getCategory(id: string | number) {
    if (this.authService.isGuest()) {
      return this.dbService.getByID<Category>('categories', id);
    }

    return this.http.get<Category>('');
  }

  createGuestCategories() {
    this.dbService.count('categories').subscribe((total) => {
      if (total === 0) {
        this.dbService.bulkAdd('categories', categories);
      }
    });
  }
}
