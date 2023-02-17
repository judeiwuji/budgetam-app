import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import Transaction from 'src/app/models/Transaction';
import Balance from '../../models/Balance';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.css'],
})
export class BalanceCardComponent implements OnInit, OnDestroy {
  public currency = 'NGN';
  public balance: Balance = {
    expenses: 100000,
    income: 250000,
  };

  @Input()
  addTransaction!: Observable<Transaction>;

  @Input()
  deleteTransaction!: Observable<Transaction>;

  private addTransactionSubscription!: Subscription;
  private deleteTransactionSubscription!: Subscription;
  public isIncomeView = false;

  constructor() {}

  ngOnInit(): void {
    this.addTransactionSubscription = this.addTransaction.subscribe(
      (transaction) => {
        if (transaction.category.isExpense) {
          this.balance.expenses += transaction.amount;
        } else {
          this.balance.income += transaction.amount;
        }
      }
    );

    this.deleteTransactionSubscription = this.deleteTransaction.subscribe(
      (transaction) => {
        if (transaction.category.isExpense) {
          this.balance.expenses -= transaction.amount;
        } else {
          this.balance.income -= transaction.amount;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.addTransactionSubscription.unsubscribe();
    this.deleteTransactionSubscription.unsubscribe();
  }
}
