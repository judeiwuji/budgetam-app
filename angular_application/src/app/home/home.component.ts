import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Session from '../models/Session';
import User from '../models/User';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.authService.isGuest());
  }

  tryDemo() {
    // this.authService.logout();
    this.userService.createGuestUser().subscribe((user) => {
      const token = `${Date.now()}.${Math.floor(Math.random() * 1000)}|guest|${
        user.id
      }`;
      this.authService.login(token);
      this.categoryService.createGuestCategories();
    });
  }
}
