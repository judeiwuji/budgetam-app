import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryTransactionsComponent } from 'src/app/modals/category-transactions/category-transactions.component';

@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrls: ['./transaction-category.component.css'],
})
export class TransactionCategoryComponent implements OnInit {
  constructor(private readonly modal: NgbModal) {}

  showTransactions() {
    const modalInstance = this.modal.open(CategoryTransactionsComponent, {
      centered: true,
      fullscreen: true,
      backdrop: 'static',
    });
    modalInstance.componentInstance.transactions = [];
  }

  ngOnInit(): void {}
}
