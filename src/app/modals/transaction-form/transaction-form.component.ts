import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  transactionForm!: FormGroup;

  constructor(private readonly activeModal: NgbActiveModal) {
    this.transactionForm = new FormGroup({
      amount: new FormControl(0, [Validators.required]),
      note: new FormControl(''),
      cId: new FormControl('', [Validators.required]),
      date: new FormControl(new Date(), [Validators.required]),
    });
  }

  ngOnInit(): void {}

  get fc() {
    return this.transactionForm.controls;
  }

  close() {
    this.activeModal.close();
  }

  save() {}

  create() {}

  update() {}
}
