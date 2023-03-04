import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent implements OnInit {
  processing = false;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  tryDemo() {
    if (this.processing) return;

    this.processing = true;
    this.userService.createGuestUser().subscribe((user) => {
      this.processing = false;
      const token = `${Date.now()}.${Math.floor(Math.random() * 1000)}|guest|${
        user.id
      }`;
      this.authService.login(token);
      this.categoryService.createGuestCategories();
    });
  }
}
