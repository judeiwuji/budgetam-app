import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Category from 'src/app/models/Category';
import Transaction from 'src/app/models/Transaction';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  public transactionForm!: FormGroup;
  public categories: Category[] = [
    { id: '1', name: 'Food', icon: '🥘', isExpense: true },
    {
      id: '2',
      name: 'Airtime & Subscription',
      icon: '📱',
      isExpense: true,
    },
    {
      id: '3',
      name: 'Utility bills',
      icon: '📜',
      isExpense: true,
    },
    {
      id: '4',
      name: 'Income & Earnings',
      icon: '💰',
      isExpense: false,
    },
  ];
  public selectedCategory!: Category;
  @Input()
  onCreate!: Subject<Transaction>;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly toastrService: ToastrService
  ) {
    const transactionDate = this.getDate();
    this.transactionForm = new FormGroup({
      amount: new FormControl(0, [Validators.required]),
      note: new FormControl(''),
      date: new FormControl(transactionDate),
    });
  }

  ngOnInit(): void {
    this.selectedCategory = this.categories[0];
  }

  get fc() {
    return this.transactionForm.controls;
  }

  close() {
    this.activeModal.close();
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  selectAll(event: any) {
    event.target.select();
  }

  getDate(): NgbDateStruct {
    const today = new Date();

    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
  }

  resetForm() {
    this.transactionForm.reset({ amount: 0, note: '', date: this.getDate() });
    this.selectedCategory = this.categories[0];
  }

  save() {
    this.create();
  }

  create() {
    const transaction = new Transaction();
    const date: NgbDateStruct = this.fc['date'].value;
    transaction.amount = Number(this.fc['amount'].value);
    transaction.note = this.fc['note'].value;
    transaction.categoryId = this.selectedCategory.id;
    transaction.date = `${date.year}-${date.month}-${date.day}`;

    this.onCreate.next(transaction);
    this.toastrService.success('Saved');
    this.resetForm();
  }

  update() {}
}
