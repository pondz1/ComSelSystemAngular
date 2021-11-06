import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBuyListComponent } from './product-buy-list.component';

describe('ProductBuyListComponent', () => {
  let component: ProductBuyListComponent;
  let fixture: ComponentFixture<ProductBuyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductBuyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBuyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
