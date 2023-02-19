import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TransactionFormComponent } from 'src/app/modals/transaction-form/transaction-form.component';
import Transaction from 'src/app/models/Transaction';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  @Input()
  public transaction!: Transaction;

  constructor(
    private readonly modal: NgbModal,
    private readonly deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {}

  editTransaction() {
    const modalInstance = this.modal.open(TransactionFormComponent, {
      size: 'md',
      fullscreen: this.deviceService.isMobile(),
      backdrop: 'static',
      scrollable: true,
    });

    modalInstance.componentInstance.transaction = this.transaction;
  }
}
