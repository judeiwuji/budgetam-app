import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { TransactionFormComponent } from '../modals/transaction-form/transaction-form.component';
import { TransactionsComponent } from '../modals/transactions/transactions.component';
import Transaction from '../models/Transaction';
import User from '../models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public user = new User('judoski');
  public addTransactionSubject = new Subject<Transaction>();
  public deleteTransactionSubject = new Subject<Transaction>();

  constructor(private readonly modal: NgbModal) {}

  ngOnInit(): void {}

  createTransaction() {
    const modalInstance = this.modal.open(TransactionFormComponent, {
      fullscreen: true,
      backdrop: 'static',
    });

    const newTransactionSubject = new Subject<Transaction>();
    modalInstance.componentInstance.onCreate = newTransactionSubject;
    modalInstance.result.then(() => {
      newTransactionSubject.unsubscribe();
    });
    newTransactionSubject.subscribe((transaction) => {
      this.addTransactionSubject.next(transaction);
    });
  }

  allTransactions() {
    this.modal.open(TransactionsComponent, {
      fullscreen: true,
      backdrop: 'static',
    });
  }

  ngOnDestroy(): void {
    this.addTransactionSubject.unsubscribe();
    this.deleteTransactionSubject.unsubscribe();
  }
}
