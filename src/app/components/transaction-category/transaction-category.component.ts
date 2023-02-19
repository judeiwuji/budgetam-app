import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { CategoryTransactionsComponent } from 'src/app/modals/category-transactions/category-transactions.component';
import { TransactionSummaryView } from 'src/app/models/enums/TransactionView';
import Transaction, { EditedTransaction } from 'src/app/models/Transaction';
import TransactionCategory from 'src/app/models/TransactionCategory';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrls: ['./transaction-category.component.css'],
})
export class TransactionCategoryComponent implements OnInit {
  @Input()
  transaction!: TransactionCategory;

  @Input()
  currentView!: TransactionSummaryView;

  @Input()
  onEditTransaction!: Subject<EditedTransaction>;

  @Input()
  onDeleteTransaction!: Subject<Transaction>;

  constructor(
    private readonly modal: NgbModal,
    private readonly transactionService: TransactionService
  ) {}

  showTransactions() {
    const modalInstance = this.modal.open(CategoryTransactionsComponent, {
      centered: true,
      fullscreen: true,
      backdrop: 'static',
      // scrollable: true,
    });
    modalInstance.componentInstance.category = this.transaction.category;
    modalInstance.componentInstance.onEditTransaction = this.onEditTransaction;
    modalInstance.componentInstance.onDeleteTransaction =
      this.onDeleteTransaction;

    switch (this.currentView) {
      case TransactionSummaryView.daily:
        this.transactionService
          .getDailyTransactions(this.transaction.category.id as string)
          .subscribe({
            next: (transactions) => {
              modalInstance.componentInstance.transactions = transactions;
            },
          });
        break;
      case TransactionSummaryView.weekly:
        this.transactionService
          .getWeeklyTransactions(this.transaction.category.id as string)
          .subscribe({
            next: (transactions) => {
              modalInstance.componentInstance.transactions = transactions;
            },
          });
        break;
      case TransactionSummaryView.monthly:
        this.transactionService
          .getMonthlyTransactions(this.transaction.category.id as string)
          .subscribe({
            next: (transactions) => {
              modalInstance.componentInstance.transactions = transactions;
            },
          });
    }
  }

  ngOnInit(): void {}
}
