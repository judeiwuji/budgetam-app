import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import Category from 'src/app/models/Category';
import Transaction, { EditedTransaction } from 'src/app/models/Transaction';
import TransactionProvider from 'src/app/providers/TransactionProvider';

@Component({
  selector: 'app-category-transactions',
  templateUrl: './category-transactions.component.html',
  styleUrls: ['./category-transactions.component.css'],
})
export class CategoryTransactionsComponent implements OnInit {
  private transactionProvider = TransactionProvider.getInstance();
  @Input()
  public category!: Category;

  constructor(private readonly activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.transactionProvider.onDeleteTransaction((transaction: Transaction) => {
      if (this.category) {
        console.log(transaction);
        const index = this.category?.transactions?.findIndex(
          (d) => d.id === transaction.id
        );
        if (index !== -1) {
          this.category?.transactions?.splice(index as number, 1);
        }
      }
    });
  }

  close() {
    this.activeModal.close();
  }
}
