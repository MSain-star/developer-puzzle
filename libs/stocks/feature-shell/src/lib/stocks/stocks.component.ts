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
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, fromDate, toDate);
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
}
