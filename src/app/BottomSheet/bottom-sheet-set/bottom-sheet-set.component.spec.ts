import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetSetComponent } from './bottom-sheet-set.component';

describe('BottomSheetSetComponent', () => {
  let component: BottomSheetSetComponent;
  let fixture: ComponentFixture<BottomSheetSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomSheetSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomSheetSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
