import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetListComponent } from './product-set-list.component';

describe('ProductSetListComponent', () => {
  let component: ProductSetListComponent;
  let fixture: ComponentFixture<ProductSetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSetListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
