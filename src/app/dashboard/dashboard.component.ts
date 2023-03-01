import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ProfileComponent } from '../modals/profile/profile.component';
import { TransactionFormComponent } from '../modals/transaction-form/transaction-form.component';
import { TransactionsComponent } from '../modals/transactions/transactions.component';
import { LinkManager } from '../models/LinkManager';
import User from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public user = new User('');
  public baseUrl = LinkManager.baseUrl;

  constructor(
    private readonly modal: NgbModal,
    private readonly deviceService: DeviceDetectorService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  createTransaction() {
    this.modal.open(TransactionFormComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });
  }

  allTransactions() {
    this.modal.open(TransactionsComponent, {
      fullscreen: true,
      backdrop: 'static',
    });
  }

  editProfile() {
    const modalInstance = this.modal.open(ProfileComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      scrollable: true,
      centered: true,
      backdrop: 'static',
    });

    modalInstance.componentInstance.user = this.user;
    modalInstance.result.then((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnDestroy(): void {}
}
