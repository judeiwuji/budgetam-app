import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from './auth.service';
import { map, Observable, switchMap } from 'rxjs';
import Balance from '../models/Balance';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import { CategoryService } from './category.service';
import * as moment from 'moment';
import TransactionCategory from '../models/TransactionCategory';
import { LinkManager } from '../models/LinkManager';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  api = LinkManager.baseUrl + '/api';
  store = 'transactions';

  constructor(
    private readonly http: HttpClient,
    private readonly dbService: NgxIndexedDBService,
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService
  ) {}

  getBalance(userId?: string): Observable<Balance> {
    if (this.authService.isGuest()) {
      return this.getGuestBalance();
    }
    return this.http.get<Balance>(`${this.api}/balance`);
  }

  getDailyCategorizeTransactions() {
    if (this.authService.isGuest()) {
      return this.getGuestDailyCategorizeTransactions();
    }
    return this.http.get<TransactionCategory[]>(`${this.api}/daily/transactions`);
  }

  getWeeklyCategorizeTransactions() {
    if (this.authService.isGuest()) {
      return this.getGuestWeeklyCategorizeTransactions();
    }
    return this.http.get<TransactionCategory[]>(`${this.api}/weekly/transactions`);
  }

  getMonthlyCategorizeTransactions() {
    if (this.authService.isGuest()) {
      return this.getGuestMonthlyCategorizeTransactions();
    }
    return this.http.get<TransactionCategory[]>(`${this.api}/monthly/transactions`);
  }

  createTransaction(transaction: Transaction) {
    if (this.authService.isGuest()) {
      return this.createGuestTransaction(transaction);
    }

    return this.http.post<Transaction>(`${this.api}/transactions`, transaction);
  }

  updateTransaction(transaction: Transaction) {
    if (this.authService.isGuest()) {
      return this.updateGuestTransaction(transaction);
    }
    return this.http.put<boolean>(this.api, transaction);
  }

  deleteTransaction(transaction: Transaction) {
    if (this.authService.isGuest()) {
      return this.deleteGuestTransaction(transaction);
    }
    return this.http.delete(this.api);
  }

  private getGuestBalance() {
    return this.getGuestTransactions().pipe(
      map((transactions) => {
        const balance = new Balance();

        for (const transaction of this.monthlyTransactionFilter(transactions)) {
          if (transaction.category.isExpense) {
            balance.expenses += transaction.amount;
          } else {
            balance.income += transaction.amount;
          }
        }
        return balance;
      })
    );
  }

  private createGuestTransaction(transaction: Transaction) {
    return this.dbService.add<Transaction>(this.store, transaction).pipe(
      switchMap((id) => {
        return this.dbService.getByID<Transaction>(this.store, id);
      }),
      switchMap((transaction) => {
        return this.categoryService.getCategory(transaction.categoryId).pipe(
          map((category) => {
            transaction.category = category;
            return transaction;
          })
        );
      })
    );
  }

  private getGuestTransactions() {
    return this.dbService.getAll<Transaction>(this.store).pipe(
      switchMap((transactions) => {
        return this.categoryService.getCategories().pipe(
          map((categories) => {
            for (const transaction of transactions) {
              transaction.category = categories.find(
                (d) => d.id === transaction.categoryId
              ) as Category;
            }
            return transactions;
          })
        );
      })
    );
  }

  private dailyTransactionFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const today = moment();
      const transactionDate = moment(new Date(transaction.date));
      const hours = today.diff(transactionDate, 'hours');
      return hours <= 23;
    });
  }

  private weeklyTransactionFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const now = moment();
      const sunday = now.clone().weekday(0);
      const saturday = now.clone().weekday(6);
      const transactionDate = moment(new Date(transaction.date));
      return transactionDate.isBetween(sunday, saturday, 'dates', '[]');
    });
  }

  private monthlyTransactionFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const today = moment();
      const totalDays = today.daysInMonth();
      const firstDayOfMonth = moment(
        new Date(`${today.year()}/${today.month() + 1}/1`)
      );
      const lastDayOfMonth = moment(
        new Date(`${today.year()}-${today.month() + 1}-${totalDays}`)
      );
      const transactionDate = moment(new Date(transaction.date));

      return transactionDate.isBetween(
        firstDayOfMonth,
        lastDayOfMonth,
        'dates',
        '[]'
      );
    });
  }

  categoriseTransactions(
    filter: (transaction: Transaction[]) => Transaction[]
  ) {
    return this.categoryService.getCategories().pipe(
      switchMap((categories) => {
        return this.dbService.getAll<Transaction>(this.store).pipe(
          map((transactions) => ({
            transactions: filter(transactions),
            categories,
          }))
        );
      }),
      map((data) => {
        const categories: any = {};

        for (const transaction of data.transactions) {
          const category = data.categories.find(
            (d) => d.id === transaction.categoryId
          );

          if (category) {
            const item = categories[category.id as string];

            transaction.category = category;
            if (item) {
              item.category.transactions.push(transaction);
              item.amount += transaction.amount;
              ++item.count;
            } else {
              category.transactions = [transaction];
              categories[category.id as string] = new TransactionCategory(
                category,
                transaction.amount,
                1
              );
            }
          }
        }
        return Object.values(categories) as TransactionCategory[];
      })
    );
  }

  private getGuestDailyCategorizeTransactions() {
    return this.categoriseTransactions(this.dailyTransactionFilter);
  }

  private getGuestWeeklyCategorizeTransactions() {
    return this.categoriseTransactions(this.weeklyTransactionFilter);
  }

  private getGuestMonthlyCategorizeTransactions() {
    return this.categoriseTransactions(this.monthlyTransactionFilter);
  }

  // private getGuestDailyTransactions(categoryId: string | number) {
  //   return this.getGuestTransactions().pipe(
  //     map(this.dailyTransactionFilter),
  //     map((transactions) =>
  //       transactions.filter((d) => d.categoryId === categoryId)
  //     )
  //   );
  // }

  // private getGuestWeeklyTransactions(categoryId: string | number) {
  //   return this.getGuestTransactions().pipe(
  //     map(this.weeklyTransactionFilter),
  //     map((transactions) =>
  //       transactions.filter((d) => d.categoryId === categoryId)
  //     )
  //   );
  // }

  // private getGuestMonthlyTransactions(categoryId: string | number) {
  //   return this.getGuestTransactions().pipe(
  //     map(this.monthlyTransactionFilter),
  //     map((transactions) =>
  //       transactions.filter((d) => d.categoryId === categoryId)
  //     )
  //   );
  // }

  private updateGuestTransaction(transaction: Transaction) {
    return this.dbService
      .update<Transaction>(this.store, transaction)
      .pipe(map((updated) => !!updated));
  }

  private deleteGuestTransaction(transaction: Transaction) {
    return this.dbService.deleteByKey(this.store, transaction.id);
  }
}
