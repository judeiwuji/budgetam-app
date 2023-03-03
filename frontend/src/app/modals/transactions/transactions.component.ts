import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  constructor(private readonly activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  close() {
    this.activeModal.close();
  }
}
