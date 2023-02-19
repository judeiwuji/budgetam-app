import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import Transaction from 'src/app/models/Transaction';
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

  @Input()
  addTransaction!: Observable<Transaction>;

  @Input()
  deleteTransaction!: Observable<Transaction>;

  private addTransactionSubscription!: Subscription;
  private deleteTransactionSubscription!: Subscription;
  public isIncomeView = false;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly toastrService: ToastrService,
    private readonly categoryService: CategoryService
  ) {}

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

    this.getBalance();
  }

  ngOnDestroy(): void {
    this.addTransactionSubscription.unsubscribe();
    this.deleteTransactionSubscription.unsubscribe();
  }

  getBalance() {
    this.transactionService.getBalance().subscribe({
      next: (balance) => {
        if (balance) {
          this.balance = balance;
        }
        console.log(balance);
      },
      error: (err) => {
        this.toastrService.warning(
          'Sorry, we were unable to complete your request'
        );
      },
    });
  }
}
