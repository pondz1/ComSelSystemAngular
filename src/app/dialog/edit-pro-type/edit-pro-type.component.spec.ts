import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProTypeComponent } from './edit-pro-type.component';

describe('EditProTypeComponent', () => {
  let component: EditProTypeComponent;
  let fixture: ComponentFixture<EditProTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
