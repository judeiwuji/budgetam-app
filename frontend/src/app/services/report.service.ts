import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { LinkManager } from '../models/LinkManager';
import Transaction from '../models/Transaction';
import TransactionCategory from '../models/TransactionCategory';
import { AuthService } from './auth.service';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private api = LinkManager.baseUrl + '/api';

  constructor(
    private readonly authService: AuthService,
    private readonly transactionService: TransactionService,
    private readonly http: HttpClient
  ) {}

  public getWeeklyReport() {
    if (this.authService.isGuest()) {
      return this.getGuestWeeklyReport();
    }
    return this.http.get<TransactionCategory[]>(
      `${this.api}/weekly/transactions`
    );
  }

  public getMonthlyReport() {
    if (this.authService.isGuest()) {
      return this.getGuestMonthlyReport();
    }
    return this.http.get<TransactionCategory[]>(
      `${this.api}/current/year/transactions`
    );
  }

  public getYearlyReport() {
    if (this.authService.isGuest()) {
      return this.getGuestYearlyReport();
    }
    return this.http.get<TransactionCategory[]>(
      `${this.api}/yearly/transactions`
    );
  }

  private getGuestWeeklyReport() {
    return this.transactionService.categoriseTransactions(
      this.weeklyReportFilter
    );
  }

  private getGuestMonthlyReport() {
    return this.transactionService.categoriseTransactions(
      this.monthlyReportFilter
    );
  }

  private getGuestYearlyReport() {
    return this.transactionService.categoriseTransactions(
      this.yearlyReportFilter
    );
  }

  private weeklyReportFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const now = moment();
      const sunday = now.clone().weekday(0);
      const saturday = now.clone().weekday(6);
      const transactionDate = moment(new Date(transaction.date));
      return transactionDate.isBetween(sunday, saturday, 'dates', '[]');
    });
  }

  private monthlyReportFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const today = moment();
      const firstMonthOfYear = moment(new Date(`${today.year()}/1/1`));
      const lastMonthOfYear = moment(new Date(`${today.year()}-12-31`));
      const transactionDate = moment(new Date(transaction.date));

      return transactionDate.isBetween(
        firstMonthOfYear,
        lastMonthOfYear,
        'dates',
        '[]'
      );
    });
  }

  private yearlyReportFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const today = moment();
      const lastTwoYears = today.clone().subtract(2, 'years');
      const transactionDate = moment(new Date(transaction.date));

      return transactionDate.isBetween(lastTwoYears, today, 'dates', '[]');
    });
  }
}
