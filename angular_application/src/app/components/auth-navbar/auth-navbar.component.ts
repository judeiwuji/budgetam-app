import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.css'],
})
export class AuthNavbarComponent implements OnInit {
  @Input()
  currentPage?: string;

  constructor() {}

  ngOnInit(): void {}
}
