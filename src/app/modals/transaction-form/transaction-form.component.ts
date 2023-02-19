import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Category from 'src/app/models/Category';
import Transaction, { EditedTransaction } from 'src/app/models/Transaction';
import TransactionProvider from 'src/app/providers/TransactionProvider';
import { CategoryService } from 'src/app/services/category.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  public transactionForm!: FormGroup;
  public categories: Category[] = [];
  public selectedCategory!: Category;
  public processing = false;
  public transactionProvider = TransactionProvider.getInstance();

  @Input()
  onCreate!: Subject<Transaction>;

  @Input()
  transaction?: Transaction;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly toastrService: ToastrService,
    private readonly categoryService: CategoryService,
    private readonly transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    const transactionDate = this.getDateStruct(
      this.transaction ? this.transaction.date : ''
    );
    this.transactionForm = new FormGroup({
      amount: new FormControl(this.transaction ? this.transaction.amount : 0, [
        Validators.required,
      ]),
      note: new FormControl(this.transaction ? this.transaction.note : ''),
      date: new FormControl(transactionDate),
    });
    if (this.transaction) {
      this.selectedCategory = this.transaction.category;
    }
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

  getDateStruct(date?: string): NgbDateStruct {
    const d = date ? new Date(date) : new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }

  resetForm() {
    this.transactionForm.reset({
      amount: 0,
      note: '',
      date: this.getDateStruct(),
    });
    this.selectedCategory = this.categories[0];
  }

  save() {
    if (this.transaction) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    if (this.processing) return;
    this.processing = true;

    const newTransaction = new Transaction();
    const date: NgbDateStruct = this.fc['date'].value;
    newTransaction.amount = Number(this.fc['amount'].value);
    newTransaction.note = this.fc['note'].value;
    newTransaction.categoryId = this.selectedCategory.id as string;
    newTransaction.date = `${date.year}-${date.month}-${date.day}`;

    this.transactionService
      .createTransaction(newTransaction)
      .subscribe((response) => {
        this.processing = false;
        if (response) {
          this.transactionProvider.createTransaction(response);
          this.toastrService.success('Saved');
          this.resetForm();
        }
      });
  }

  update() {
    if (this.processing) return;
    this.processing = true;

    const update = new Transaction();
    const date: NgbDateStruct = this.fc['date'].value;
    update.amount = Number(this.fc['amount'].value);
    update.note = this.fc['note'].value;
    update.categoryId = this.selectedCategory.id as string;
    update.date = `${date.year}-${date.month}-${date.day}`;
    update.id = this.transaction?.id as string;

    this.transactionService.updateTransaction(update).subscribe((response) => {
      this.processing = false;
      if (response) {
        this.toastrService.success('Updated');
        update.category = this.selectedCategory;
        const edited = new EditedTransaction(
          this.transaction as Transaction,
          update
        );
        this.transactionProvider.editTransaction(edited);
        this.activeModal.close(update);
      }
    });
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        if (categories) {
          this.categories = categories;
          if (!this.transaction) {
            this.selectedCategory = this.categories[0];
          }
        }
      },
      error: (err) => {},
    });
  }

  dateFormat() {
    const date: NgbDateStruct = this.fc['date'].value;
    return moment(new Date(`${date.year}-${date.month}-${date.day}`)).format(
      'MMM Do YYYY'
    );
  }
}
