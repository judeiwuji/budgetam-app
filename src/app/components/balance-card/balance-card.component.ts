import { Component, OnInit } from '@angular/core';
import Balance from '../../models/Balance';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.css'],
})
export class BalanceCardComponent implements OnInit {
  public currency = 'NGN';
  public balance: Balance = {
    expenses: 100000,
    income: 250000,
  };
  constructor() {}

  ngOnInit(): void {}
}
