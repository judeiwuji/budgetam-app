import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Category from 'src/app/models/Category';
import Transaction from 'src/app/models/Transaction';

@Component({
  selector: 'app-category-transactions',
  templateUrl: './category-transactions.component.html',
  styleUrls: ['./category-transactions.component.css'],
})
export class CategoryTransactionsComponent implements OnInit {
  public transactions: Transaction[] = [];
  public category?: Category;

  constructor(private readonly activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  close() {
    this.activeModal.close();
  }
}
