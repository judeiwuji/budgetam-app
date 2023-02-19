import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import Transaction from 'src/app/models/Transaction';
import TransactionCategory from 'src/app/models/TransactionCategory';
import { TransactionService } from 'src/app/services/transaction.service';
import { TransactionSummaryView as TransactionViews } from '../../models/enums/TransactionView';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit {
  public isDailyTransactions = false;
  public isWeeklyTransactions = false;
  public isMonthlyTransactions = false;
  public currentView!: TransactionViews;

  public transactionDB: {
    [TransactionViews.daily]: TransactionCategory[];
    [TransactionViews.weekly]: TransactionCategory[];
    [TransactionViews.monthly]: TransactionCategory[];
  } = {
    [TransactionViews.daily]: [],
    [TransactionViews.weekly]: [],
    [TransactionViews.monthly]: [],
  };

  @Input()
  addTransaction?: Observable<Transaction>;

  constructor(private readonly transactionService: TransactionService) {}

  ngOnInit(): void {
    this.setView(TransactionViews.daily);
    if (this.addTransaction) {
      this.addTransaction.subscribe((transaction) => {
        const transactions = this.transactionDB[this.currentView];
        let transactionCategory = transactions.find(
          (d) => d.category.id === transaction.categoryId
        );
        if (transactionCategory) {
          transactionCategory.count++;
          transactionCategory.amount += transaction.amount;
        } else {
          transactionCategory = new TransactionCategory(
            transaction.category,
            transaction.amount,
            1
          );
          this.transactionDB[this.currentView].unshift(transactionCategory);
        }
      });
    }
  }

  setView(mode: TransactionViews) {
    this.currentView = mode;
    this.isDailyTransactions = mode === TransactionViews.daily;
    this.isWeeklyTransactions = mode === TransactionViews.weekly;
    this.isMonthlyTransactions = mode === TransactionViews.monthly;
    this.getTransactions();
  }

  getTransactions() {
    let transactionSub: Subscription;

    switch (this.currentView) {
      case TransactionViews.daily:
        transactionSub = this.transactionService
          .getDailyCategorizeTransactions()
          .subscribe({
            next: (transactions) => {
              this.transactionDB[this.currentView] = transactions;
            },
            error: (err) => {},
            complete() {
              transactionSub.unsubscribe();
            },
          });
        break;
      case TransactionViews.weekly:
        transactionSub = this.transactionService
          .getWeeklyCategorizeTransactions()
          .subscribe({
            next: (transactions) => {
              this.transactionDB[this.currentView] = transactions;
            },
            error: (err) => {},
            complete() {
              transactionSub.unsubscribe();
            },
          });
        break;
      case TransactionViews.monthly:
        transactionSub = this.transactionService
          .getMonthlyCategorizeTransactions()
          .subscribe({
            next: (transactions) => {
              this.transactionDB[this.currentView] = transactions;
            },
            error: (err) => {},
            complete() {
              transactionSub.unsubscribe();
            },
          });
        break;
    }
  }
}
