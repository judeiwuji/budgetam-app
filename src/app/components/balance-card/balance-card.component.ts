import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import Transaction from 'src/app/models/Transaction';
import TransactionProvider from 'src/app/providers/TransactionProvider';
import { CategoryService } from 'src/app/services/category.service';
import { TransactionService } from 'src/app/services/transaction.service';
import Balance from '../../models/Balance';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.css'],
})
export class BalanceCardComponent implements OnInit, OnDestroy {
  public currency = 'NGN';
  public balance = new Balance();
  public transactionProvider = TransactionProvider.getInstance();
  private createTransactionSubscription!: Subscription;
  private editTransactionSubscription!: Subscription;
  private deleteTransactionSubscription!: Subscription;
  public isIncomeView = false;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly toastrService: ToastrService,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.createTransactionSubscription =
      this.transactionProvider.onCreateTransaction((transaction) => {
        if (transaction.category.isExpense) {
          this.balance.expenses += transaction.amount;
        } else {
          this.balance.income += transaction.amount;
        }
      });

    this.editTransactionSubscription =
      this.transactionProvider.onEditTransaction((edited) => {
        if (edited.newTransaction.category.isExpense) {
          this.balance.expenses -= edited.oldTransaction.amount;
          this.balance.expenses += edited.newTransaction.amount;
        } else {
          this.balance.income -= edited.oldTransaction.amount;
          this.balance.income += edited.newTransaction.amount;
        }
      });

    this.deleteTransactionSubscription =
      this.transactionProvider.onDeleteTransaction((transaction) => {
        if (transaction.category.isExpense) {
          this.balance.expenses -= transaction.amount;
        } else {
          this.balance.income -= transaction.amount;
        }
      });
    this.getBalance();
  }

  getBalance() {
    this.transactionService.getBalance().subscribe({
      next: (balance) => {
        if (balance) {
          this.balance = balance;
        }
      },
      error: (err) => {
        this.toastrService.warning(
          'Sorry, we were unable to complete your request'
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.createTransactionSubscription.unsubscribe();
    this.editTransactionSubscription.unsubscribe();
    this.deleteTransactionSubscription.unsubscribe();
  }
}
