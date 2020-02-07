import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;
  fromDate: Date;
  toDate: Date;
  maxDate = new Date();
  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' }
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date())
    });
  }

  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, this.calculatePeriod());
    }
  }

  
  validation = (type: string, event: MatDatepickerInputEvent<Date>): void => {
    if (type === 'from') {
      if (new Date(event.value) > this.stockPickerForm.value.toDate) {
        this.stockPickerForm.controls.fromDate.setValue(
          this.stockPickerForm.value.toDate
        );
      }
    } else if (type === 'to') {
      if (new Date(event.value) < this.stockPickerForm.value.fromDate) {
        this.stockPickerForm.controls.toDate.setValue(
          this.stockPickerForm.value.fromDate
        );
      }
    }
  };

  calculatePeriod = (): string => {
    let period = '1m';
    const diff = Math.abs(
      this.stockPickerForm.value.fromDate - this.stockPickerForm.value.toDate
    );
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    if (diffDays <= 30) {
      period = '1m';
    } else if (diffDays <= 90 && diffDays > 30) {
      period = '3m';
    } else if (diffDays <= 180 && diffDays > 90) {
      period = '6m';
    } else if (diffDays < 365 && diffDays > 180) {
      period = 'ytd';
    } else if (diffDays === 365) {
      period = '1y';
    } else if (diffDays <= 2 * 365 && diffDays > 365) {
      period = '2y';
    } else if (diffDays <= 5 * 365 && diffDays > 2 * 365) {
      period = '5y';
    } else {
      period = 'max';
    }
    return period.toString();
  };
}
