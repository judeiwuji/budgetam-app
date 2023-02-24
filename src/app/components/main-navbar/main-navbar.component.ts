import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css'],
})
export class MainNavbarComponent implements OnInit {
  isAuthentic = false;
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthentic = this.authService.isAuthenticated();
  }
}
