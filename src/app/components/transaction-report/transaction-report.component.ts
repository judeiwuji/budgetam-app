import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionReportViews } from 'src/app/models/enums/TransactionReportViews';
import Transaction from 'src/app/models/Transaction';
import TransactionCategory from 'src/app/models/TransactionCategory';
import { TransactionSummaryView as TransactionViews } from '../../models/enums/TransactionView';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css'],
})
export class TransactionReportComponent implements OnInit {
  public isWeekReport = false;
  public isMonthReport = false;
  public isYearReport = false;
  public currentView!: TransactionReportViews;

  public transactionDB: {
    [TransactionReportViews.week]: TransactionCategory[];
    [TransactionReportViews.month]: TransactionCategory[];
    [TransactionReportViews.year]: TransactionCategory[];
  } = {
    [TransactionReportViews.week]: [
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
    [TransactionReportViews.month]: [],
    [TransactionReportViews.year]: [],
  };

  @Input()
  addTransaction?: Observable<Transaction>;

  constructor() {}

  ngOnInit(): void {
    this.setView(TransactionReportViews.week);
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
        }
      });
    }
  }

  setView(mode: TransactionReportViews) {
    this.currentView = mode;
    this.isWeekReport = mode === TransactionReportViews.week;
    this.isMonthReport = mode === TransactionReportViews.month;
    this.isYearReport = mode === TransactionReportViews.year;
  }
}
