import { Component, OnInit } from '@angular/core';
import User from '../models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public user = new User('judoski');
  public currency = 'NGN';
  public balance = {
    expenses: 100000,
    income: 250000,
  };
  constructor() {}

  ngOnInit(): void {}
}
