import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<any>;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  chartData: any;

  chart: {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: { title: `Stock price`, width: '600', height: '400' }
  };
  constructor(private cd: ChangeDetectorRef) { }

  filterData = (element, index, array): void => {
    const dateVal: Date = new Date(element[0]);
    if (new Date(this.fromDate) <= dateVal && new Date(this.toDate) >= dateVal) {
      this.chartData.push(element);
    }
  };

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$.subscribe(newData => {
      this.chartData = [];
      newData.some(this.filterData);
    });
  }
}
