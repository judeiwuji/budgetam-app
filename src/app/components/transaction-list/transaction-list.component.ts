import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import Transaction, { EditedTransaction } from 'src/app/models/Transaction';
import TransactionCategory from 'src/app/models/TransactionCategory';
import TransactionProvider from 'src/app/providers/TransactionProvider';
import { TransactionService } from 'src/app/services/transaction.service';
import { TransactionSummaryView as TransactionViews } from '../../models/enums/TransactionView';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit, OnDestroy {
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
  private createTransactionSubscription!: Subscription;
  private editTransactionSubscription!: Subscription;
  private deleteTransactionSubscription!: Subscription;

  private transactionProvider = TransactionProvider.getInstance();

  constructor(private readonly transactionService: TransactionService) {}
  ngOnDestroy(): void {
    this.createTransactionSubscription.unsubscribe();
    this.editTransactionSubscription.unsubscribe();
    this.deleteTransactionSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setView(TransactionViews.daily);
    this.createTransactionSubscription =
      this.transactionProvider.onCreateTransaction((transaction) => {
        const transactions = this.transactionDB[this.currentView];
        let transactionCategory = transactions.find(
          (d) => d.category.id === transaction.catId
        );
        if (transactionCategory) {
          transactionCategory.count++;
          transactionCategory.amount += transaction.amount;
          transactionCategory.category.transactions;
        } else {
          transactionCategory = new TransactionCategory(
            transaction.category,
            transaction.amount,
            1
          );
          this.transactionDB[this.currentView].unshift(transactionCategory);
        }

        if (transactionCategory.category.transactions) {
          transactionCategory.category.transactions.push(transaction);
        } else {
          transactionCategory.category.transactions = [transaction];
        }
      });

    this.editTransactionSubscription =
      this.transactionProvider.onEditTransaction((edited) => {
        const transactions = this.transactionDB[this.currentView];
        let transactionCategory = transactions.find(
          (d) => d.category.id === edited.oldTransaction.catId
        );

        if (
          transactionCategory &&
          transactionCategory.category.id !== edited.newTransaction.catId
        ) {
          --transactionCategory.count;
          transactionCategory.amount -= edited.oldTransaction.amount;
          transactionCategory = transactions.find(
            (d) => d.category.id === edited.newTransaction.catId
          );

          if (transactionCategory) {
            transactionCategory.amount += edited.newTransaction.amount;
            ++transactionCategory.count;
          } else {
            transactionCategory = new TransactionCategory(
              edited.newTransaction.category,
              edited.newTransaction.amount,
              1
            );
            this.transactionDB[this.currentView].unshift(transactionCategory);
          }
        } else if (transactionCategory) {
          transactionCategory.amount -= edited.oldTransaction.amount;
          transactionCategory.amount += edited.newTransaction.amount;
        } else {
          // do nothing
        }
      });

    this.deleteTransactionSubscription =
      this.transactionProvider.onDeleteTransaction((transaction) => {
        const transactions = this.transactionDB[this.currentView];
        let transactionCategory = transactions.find(
          (d) => d.category.id === transaction.catId
        );

        if (transactionCategory) {
          --transactionCategory.count;
          transactionCategory.amount -= transaction.amount;
        }
      });
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
