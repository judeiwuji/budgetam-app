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
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  api = '';
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
    return this.http.get<Balance>(this.api);
  }

  getDailyCategorizeTransactions() {
    if (this.authService.isGuest()) {
      return this.getGuestDailyCategorizeTransactions();
    }
    return this.http.get<TransactionCategory[]>(this.api);
  }

  getWeeklyCategorizeTransactions() {
    if (this.authService.isGuest()) {
      return this.getGuestWeeklyCategorizeTransactions();
    }
    return this.http.get<TransactionCategory[]>(this.api);
  }

  getMonthlyCategorizeTransactions() {
    if (this.authService.isGuest()) {
      return this.getGuestMonthlyCategorizeTransactions();
    }
    return this.http.get<TransactionCategory[]>(this.api);
  }

  getDailyTransactions(categoryId: string | number) {
    if (this.authService.isGuest()) {
      return this.getGuestDailyTransactions(categoryId);
    }
    return this.http.get<Transaction[]>(this.api);
  }

  getWeeklyTransactions(categoryId: string | number) {
    if (this.authService.isGuest()) {
      return this.getGuestWeeklyTransactions(categoryId);
    }
    return this.http.get<Transaction[]>(this.api);
  }

  getMonthlyTransactions(categoryId: string | number) {
    if (this.authService.isGuest()) {
      return this.getGuestMonthlyTransactions(categoryId);
    }
    return this.http.get<Transaction[]>(this.api);
  }

  createTransaction(transaction: Transaction) {
    if (this.authService.isGuest()) {
      return this.createGuestTransaction(transaction);
    }
    return this.http.post<Transaction>('', transaction);
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
    return this.dbService.getAll<Transaction>(this.store).pipe(
      map((transactions) => {
        const balance = new Balance();

        for (const transaction of transactions) {
          this.dbService
            .getByID<Category>('categories', transaction.categoryId)
            .subscribe((category) => {
              if (category && category.isExpense) {
                balance.expenses += transaction.amount;
              } else {
                balance.income += transaction.amount;
              }
            });
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

  private groupTransactions(transactions: Transaction[]) {
    const transactionCategories: any = {};
    for (const transaction of transactions) {
      if (transactionCategories[transaction.categoryId]) {
        transactionCategories[transaction.categoryId].amount +=
          transaction.amount;
        ++transactionCategories[transaction.categoryId].count;
      } else {
        transactionCategories[transaction.categoryId] = new TransactionCategory(
          transaction.category,
          transaction.amount,
          1
        );
      }
    }
    return Object.values(transactionCategories) as TransactionCategory[];
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
      const today = moment();
      const transactionDate = moment(new Date(transaction.date));
      const weeks = today.diff(transactionDate, 'weeks');
      return weeks <= 7;
    });
  }

  private monthlyTransactionFilter(transactions: Transaction[]) {
    return transactions.filter((transaction) => {
      const today = moment();
      const transactionDate = moment(new Date(transaction.date));
      const months = today.diff(transactionDate, 'months');
      return months <= 1;
    });
  }

  private getGuestDailyCategorizeTransactions() {
    return this.getGuestTransactions().pipe(
      map(this.dailyTransactionFilter),
      map(this.groupTransactions)
    );
  }

  private getGuestWeeklyCategorizeTransactions() {
    return this.getGuestTransactions().pipe(
      map(this.weeklyTransactionFilter),
      map(this.groupTransactions)
    );
  }

  private getGuestMonthlyCategorizeTransactions() {
    return this.getGuestTransactions().pipe(
      map(this.monthlyTransactionFilter),
      map(this.groupTransactions)
    );
  }

  private getGuestDailyTransactions(categoryId: string | number) {
    return this.getGuestTransactions().pipe(
      map(this.dailyTransactionFilter),
      map((transactions) =>
        transactions.filter((d) => d.categoryId === categoryId)
      )
    );
  }

  private getGuestWeeklyTransactions(categoryId: string | number) {
    return this.getGuestTransactions().pipe(
      map(this.weeklyTransactionFilter),
      map((transactions) =>
        transactions.filter((d) => d.categoryId === categoryId)
      )
    );
  }

  private getGuestMonthlyTransactions(categoryId: string | number) {
    return this.getGuestTransactions().pipe(
      map(this.monthlyTransactionFilter),
      map((transactions) =>
        transactions.filter((d) => d.categoryId === categoryId)
      )
    );
  }

  private updateGuestTransaction(transaction: Transaction) {
    return this.dbService
      .update<Transaction>(this.store, transaction)
      .pipe(map((updated) => !!updated));
  }

  private deleteGuestTransaction(transaction: Transaction) {
    return this.dbService.deleteByKey(this.store, transaction.id);
  }
}
