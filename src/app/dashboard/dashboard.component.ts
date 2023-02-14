import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionFormComponent } from '../modals/transaction-form/transaction-form.component';
import { TransactionsComponent } from '../modals/transactions/transactions.component';
import User from '../models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public user = new User('judoski');
  public currency = 'NGN';
  public balance = {
    expenses: 100000,
    income: 250000,
  };
  constructor(private readonly modal: NgbModal) {}

  ngOnInit(): void {}

  createTransaction() {
    this.modal.open(TransactionFormComponent, {
      fullscreen: true,
      backdrop: 'static',
    });
  }

  allTransactions() {
    this.modal.open(TransactionsComponent, {
      fullscreen: true,
      backdrop: 'static',
    });
  }
}
