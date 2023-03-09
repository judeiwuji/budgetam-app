import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionReportViews } from 'src/app/models/enums/TransactionReportViews';
import Transaction from 'src/app/models/Transaction';
import TransactionCategory from 'src/app/models/TransactionCategory';
import { ReportService } from 'src/app/services/report.service';
import { TransactionSummaryView as TransactionViews } from '../../models/enums/TransactionView';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.css'],
})
export class TransactionReportComponent implements OnInit {
  public isWeekReport = false;
  public isMonthReport = false;
  public isYearReport = false;
  public currentView!: TransactionReportViews;

  public transactionDB: {
    [TransactionReportViews.week]: TransactionCategory[];
    [TransactionReportViews.month]: TransactionCategory[];
    [TransactionReportViews.year]: TransactionCategory[];
  } = {
    [TransactionReportViews.week]: [],
    [TransactionReportViews.month]: [],
    [TransactionReportViews.year]: [],
  };
  public isLoading = true;

  @Output()
  onChangeView = new EventEmitter();

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.setView(TransactionReportViews.week);
  }

  setView(mode: TransactionReportViews) {
    this.currentView = mode;
    this.isWeekReport = mode === TransactionReportViews.week;
    this.isMonthReport = mode === TransactionReportViews.month;
    this.isYearReport = mode === TransactionReportViews.year;

    this.getReports();
  }

  getReports() {
    if (
      !this.transactionDB[this.currentView] ||
      this.transactionDB[this.currentView].length === 0
    ) {
      this.isLoading = true;
      switch (this.currentView) {
        case TransactionReportViews.week:
          this.reportService.getWeeklyReport().subscribe({
            next: (transactions) => {
              this.transactionDB[this.currentView] = transactions;
              this.onChangeView.emit({ transactions, mode: this.currentView });
            },
            complete: () => {
              this.isLoading = false;
            },
          });
          break;
        case TransactionReportViews.month:
          this.reportService.getMonthlyReport().subscribe({
            next: (transactions) => {
              this.transactionDB[this.currentView] = transactions;
              this.onChangeView.emit({ transactions, mode: this.currentView });
            },
            complete: () => {
              this.isLoading = false;
            },
          });
          break;
        case TransactionReportViews.year:
          this.reportService.getYearlyReport().subscribe({
            next: (transactions) => {
              this.transactionDB[this.currentView] = transactions;
              this.onChangeView.emit({ transactions, mode: this.currentView });
            },
            complete: () => {
              this.isLoading = false;
            },
          });
          break;
      }
    } else {
      const transactions = this.transactionDB[this.currentView];
      this.onChangeView.emit({ transactions, mode: this.currentView });
    }
  }
}
