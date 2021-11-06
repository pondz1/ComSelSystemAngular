import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesRevenueComponent } from './report-sales-revenue.component';

describe('ReportSalesRevenueComponent', () => {
  let component: ReportSalesRevenueComponent;
  let fixture: ComponentFixture<ReportSalesRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportSalesRevenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSalesRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
