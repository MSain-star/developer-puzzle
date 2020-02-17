import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StocksComponent } from './stocks.component';
import { RouterTestingModule } from '@angular/router/testing';
import { 
  StocksDataAccessPriceQueryModule, PriceQueryFacade
  } from '@coding-challenge/stocks/data-access-price-query';
import { MatButtonModule, MatSelectModule, MatInputModule, MatFormFieldModule } from '@angular/material';
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
    priceQueryFacade = fixture.debugElement.injector.get(PriceQueryFacade);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  describe('ngOnInit()', () => {
    it('should initialize the stocks component', () => {
    component.stockPickerForm[0].valueChanges = true;
    spyOn(component, 'fetchQuote').and.stub();
    component.ngOnInit();
    expect(component.fetchQuote).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy()', () => {
    it('should do the unsubscription', () => {
      spyOn(component['unsubscribe$'], 'unsubscribe');
      spyOn(component['unsubscribe$'], 'next');
      component.ngOnDestroy();
      expect(component['unsubscribe$'].next).toHaveBeenCalledTimes(1);
      expect(component['unsubscribe$'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('fetchQuote()', () => {
    it('should fetch the query data when the form is valid', () => {
      component.stockPickerForm.controls['symbol'].setValue('Mark');
      component.stockPickerForm.controls['period'].setValue('2m');
      spyOn(priceQueryFacade, 'fetchQuote').and.stub();
      component.fetchQuote();
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('Mark', '2m');
    });
  
    it('should fetch the query data when the form is Invalid', () => {
      component.stockPickerForm.controls['symbol'].setValue('Mark');
      spyOn(priceQueryFacade, 'fetchQuote').and.stub();
      component.fetchQuote();
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });
  });

});
