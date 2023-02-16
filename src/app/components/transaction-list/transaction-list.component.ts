import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Transaction from 'src/app/models/Transaction';
import TransactionCategory from 'src/app/models/TransactionCategory';
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
    [TransactionViews.daily]: [
      {
        count: 2,
        amount: 5000,
        category: { id: '1', name: 'Food', icon: '🥘', isExpense: true },
      },
      {
        count: 5,
        amount: 2000,
        category: {
          id: '2',
          name: 'Airtime & Subscription',
          icon: '📱',
          isExpense: true,
        },
      },
      {
        count: 4,
        amount: 10000,
        category: {
          id: '3',
          name: 'Utility bills',
          icon: '📜',
          isExpense: true,
        },
      },
      {
        count: 4,
        amount: 150000,
        category: {
          id: '4',
          name: 'Income & Earnings',
          icon: '💰',
          isExpense: false,
        },
      },
    ],
    [TransactionViews.weekly]: [],
    [TransactionViews.monthly]: [],
  };

  @Input()
  addTransaction?: Observable<Transaction>;

  constructor() {}

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
          transactionCategory = new TransactionCategory();
          transactionCategory.amount = transaction.amount;
          transactionCategory.count = 1;
          transactionCategory.category = transaction.category;
        }
      });
    }
  }

  setView(mode: TransactionViews) {
    this.currentView = mode;
    this.isDailyTransactions = mode === TransactionViews.daily;
    this.isWeeklyTransactions = mode === TransactionViews.weekly;
    this.isMonthlyTransactions = mode === TransactionViews.monthly;
  }
}
