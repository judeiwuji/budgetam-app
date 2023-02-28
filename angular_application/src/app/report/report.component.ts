import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import * as moment from 'moment';
import { ReportChartData } from '../models/BarchartData';
import { TransactionReportViews } from '../models/enums/TransactionReportViews';
import Transaction from '../models/Transaction';
import TransactionCategory from '../models/TransactionCategory';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  reportChartDB: {
    [TransactionReportViews.week]?: ChartConfiguration<'bar'>['data'];
    [TransactionReportViews.month]?: ChartConfiguration<'bar'>['data'];
    [TransactionReportViews.year]?: ChartConfiguration<'bar'>['data'];
  } = {};
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  constructor() {}

  ngOnInit(): void {}

  onChangeView(data: {
    transactions: TransactionCategory[];
    mode: TransactionReportViews;
  }) {
    const transactions = data.transactions
      .map((d) => [...(d.category.transactions as Transaction[])])
      .flat(1);
    this.generateChartData(transactions, data.mode);
  }

  generateChartData(transactions: Transaction[], mode: TransactionReportViews) {
    switch (mode) {
      case TransactionReportViews.week:
        this.generateWeeklyChartData(transactions, mode);
        break;
      case TransactionReportViews.month:
        this.generateMonthlyChartData(transactions, mode);
        break;
      case TransactionReportViews.year:
        this.generateYearlyChartData(transactions, mode);
        break;
    }
  }

  generateWeeklyChartData(
    transactions: Transaction[],
    mode: TransactionReportViews
  ) {
    this.chartData = this.reportChartDB[
      mode
    ] as ChartConfiguration<'bar'>['data'];

    if (!this.chartData) {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const chartData: ChartConfiguration<'bar'>['data'] = {
        labels,
        datasets: [],
      };

      const income: any = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };
      const expenses: any = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      for (const transaction of transactions) {
        const transactionDate = moment(new Date(transaction.date));
        const weekday = transactionDate.weekday();

        if (transaction.category.isExpense) {
          expenses[labels[weekday]] += transaction.amount;
        } else {
          income[labels[weekday]] += transaction.amount;
        }
      }
      chartData.datasets = [
        { data: Object.values(expenses), label: 'Expenses' },
        { data: Object.values(income), label: 'Income' },
      ];

      this.reportChartDB[mode] = chartData;
      this.chartData = chartData;
    }
  }

  generateMonthlyChartData(
    transactions: Transaction[],
    mode: TransactionReportViews
  ) {
    this.chartData = this.reportChartDB[
      mode
    ] as ChartConfiguration<'bar'>['data'];

    if (!this.chartData) {
      const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const chartData: ChartConfiguration<'bar'>['data'] = {
        labels,
        datasets: [],
      };

      const income: any = {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      };
      const expenses: any = {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      };

      for (const transaction of transactions) {
        const transactionDate = moment(new Date(transaction.date));
        const month = transactionDate.month();

        if (transaction.category.isExpense) {
          expenses[labels[month]] += transaction.amount;
        } else {
          income[labels[month]] += transaction.amount;
        }
      }
      chartData.datasets = [
        { data: Object.values(expenses), label: 'Expenses' },
        { data: Object.values(income), label: 'Income' },
      ];

      this.reportChartDB[mode] = chartData;
      this.chartData = chartData;
    }
  }

  generateYearlyChartData(
    transactions: Transaction[],
    mode: TransactionReportViews
  ) {
    this.chartData = this.reportChartDB[
      mode
    ] as ChartConfiguration<'bar'>['data'];

    if (!this.chartData) {
      const labels = this.generateYearsLabel();
      const chartData: ChartConfiguration<'bar'>['data'] = {
        labels,
        datasets: [],
      };

      const income: any = {};
      const expenses: any = {};
      for (const label of labels) {
        income[label] = 0;
        expenses[label] = 0;
      }

      for (const transaction of transactions) {
        const transactionDate = moment(new Date(transaction.date));
        const year = transactionDate.year();
        if (transaction.category.isExpense) {
          expenses[year] += transaction.amount;
        } else {
          income[year] += transaction.amount;
        }
      }
      chartData.datasets = [
        { data: Object.values(expenses), label: 'Expenses' },
        { data: Object.values(income), label: 'Income' },
      ];
      console.log(chartData);
      this.reportChartDB[mode] = chartData;
      this.chartData = chartData;
    }
  }

  generateYearsLabel() {
    const today = moment();
    const lastTwoYears = today.clone().subtract(2, 'years');
    const labels: number[] = [];
    for (let year = lastTwoYears.year(); year <= today.year(); year++) {
      labels.push(year);
    }
    return labels;
  }
}
