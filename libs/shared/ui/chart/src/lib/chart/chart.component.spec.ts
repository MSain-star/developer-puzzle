import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleChartsModule } from 'angular-google-charts';
import { of } from 'rxjs';
import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GoogleChartsModule.forRoot()],
      declarations: [ChartComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    component.data$ = of(null);
    fixture.detectChanges();
    spyOn(component, 'data$').and.stub();
  });

  describe('ngOnInit()', () => {
    it('should be able to subscribe to change data', async () => {
      component.chart = {
        title: '',
        type: 'LineChart',
        data: [],
        columnNames: ['period', 'close'],
        options: { title: `Stock price`, width: '600', height: '400' }
      };
      component.data$ = of([['17-02-2020', '45'], ['16-02-2020', '44']]);
      component.ngOnInit();
      expect(component.chartData).toEqual([['17-02-2020', '45'], ['16-02-2020', '44']]);
      expect(component.chart.type).toEqual('LineChart');
    });
  });

  describe('ngOnDestroy()', () => {
    it('should do the unsubscription', () => {
      spyOn(component['unsubscribe$'], 'complete');
      spyOn(component['unsubscribe$'], 'next');
      component.ngOnDestroy();
      expect(component['unsubscribe$'].next).toHaveBeenCalledTimes(1);
      expect(component['unsubscribe$'].complete).toHaveBeenCalledTimes(1);
    });
  });
});
