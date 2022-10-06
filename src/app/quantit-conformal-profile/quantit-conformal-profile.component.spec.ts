import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitConformalProfileComponent } from './quantit-conformal-profile.component';

describe('QuantitConformalProfileComponent', () => {
  let component: QuantitConformalProfileComponent;
  let fixture: ComponentFixture<QuantitConformalProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantitConformalProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitConformalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
