import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TransactionFormComponent } from 'src/app/modals/transaction-form/transaction-form.component';
import Transaction from 'src/app/models/Transaction';
import TransactionProvider from 'src/app/providers/TransactionProvider';
import { TransactionService } from 'src/app/services/transaction.service';
import { Formats } from 'src/app/utils/formats';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  @Input()
  public transaction!: Transaction;
  private transactionProvider = TransactionProvider.getInstance();

  constructor(
    private readonly modal: NgbModal,
    private readonly deviceService: DeviceDetectorService,
    private readonly transactionService: TransactionService
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
    modalInstance.result.then((transaction) => {
      if (transaction) {
        this.transaction = transaction;
      }
    });
  }

  deleteTransaction() {
    this.transactionService
      .deleteTransaction(this.transaction)
      .subscribe((response) => {
        if (response) {
          this.transactionProvider.deleteTransaction(this.transaction);
        }
      });
  }

  dateFormat() {
    return Formats.date(this.transaction.date);
  }
}
