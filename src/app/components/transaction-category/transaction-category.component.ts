import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryTransactionsComponent } from 'src/app/modals/category-transactions/category-transactions.component';
import TransactionCategory from 'src/app/models/TransactionCategory';

@Component({
  selector: 'app-transaction-category',
  templateUrl: './transaction-category.component.html',
  styleUrls: ['./transaction-category.component.css'],
})
export class TransactionCategoryComponent implements OnInit {
  @Input()
  transaction!: TransactionCategory;

  constructor(private readonly modal: NgbModal) {}

  showTransactions() {
    const modalInstance = this.modal.open(CategoryTransactionsComponent, {
      centered: true,
      fullscreen: true,
      backdrop: 'static',
      scrollable: true,
    });
    modalInstance.componentInstance.transactions = [];
  }

  ngOnInit(): void {}
}
