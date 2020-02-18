import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StocksComponent } from './stocks.component';
import { 
  PriceQueryFacade
  } from '@coding-challenge/stocks/data-access-price-query';
import { MatSelectModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;
  let priceQueryFacade: PriceQueryFacade;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksComponent ],
      providers: [
        {
          provide: PriceQueryFacade, useValue: {
            priceQueries$: of([]),
            fetchQuote: jest.fn()
          }
        }
      ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SharedUiChartModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    priceQueryFacade = fixture.debugElement.injector.get(PriceQueryFacade);
    fixture.detectChanges();
  });

  describe('fetchQuote()', () => {
    it('should fetch the stock chart data as per the entered symbol and selected period when form is valid', () => {
      component.stockPickerForm.controls['symbol'].setValue('Mark');
      component.stockPickerForm.controls['period'].setValue('2m');
      spyOn(priceQueryFacade, 'fetchQuote').and.stub();
      component.fetchQuote();
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('Mark', '2m');
    });

    it('should not fetch the stock chart data if form is not valid', () => {
      component.stockPickerForm.controls['symbol'].setValue('Mark');
      spyOn(priceQueryFacade, 'fetchQuote').and.stub();
      component.fetchQuote();
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });
  });
});
