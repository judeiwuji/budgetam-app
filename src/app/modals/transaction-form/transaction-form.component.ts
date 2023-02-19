import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import Category from 'src/app/models/Category';
import Transaction from 'src/app/models/Transaction';
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

  @Input()
  onCreate!: Subject<Transaction>;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly toastrService: ToastrService,
    private readonly categoryService: CategoryService,
    private readonly transactionService: TransactionService
  ) {
    const transactionDate = this.getDate();
    this.transactionForm = new FormGroup({
      amount: new FormControl(0, [Validators.required]),
      note: new FormControl(''),
      date: new FormControl(transactionDate),
    });
  }

  ngOnInit(): void {
    this.getCategories();
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
          this.onCreate.next(response);
          this.toastrService.success('Saved');
          this.resetForm();
        }
      });
  }

  update() {}

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        if (categories) {
          this.categories = categories;
          this.selectedCategory = this.categories[0];
        }
      },
      error: (err) => {},
    });
  }
}
