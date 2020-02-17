import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() data$: Observable<any>;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  chartData: any;
  private unsubscribe$: Subject<void> = new Subject<void>();
  chart: {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: { title: `Stock price`, width: '600', height: '400' }
  };
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

  this.data$
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(newData => (this.chartData = newData));
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
