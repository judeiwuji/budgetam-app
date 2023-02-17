import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subject } from 'rxjs';
import { ProfileComponent } from '../modals/profile/profile.component';
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

  constructor(
    private readonly modal: NgbModal,
    private readonly deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {}

  createTransaction() {
    const modalInstance = this.modal.open(TransactionFormComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
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

  editProfile() {
    this.modal.open(ProfileComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });
  }

  ngOnDestroy(): void {
    this.addTransactionSubject.unsubscribe();
    this.deleteTransactionSubject.unsubscribe();
  }
}
