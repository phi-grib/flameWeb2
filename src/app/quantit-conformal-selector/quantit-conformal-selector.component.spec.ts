import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantitConformalSelectorComponent } from './quantit-conformal-selector.component';

describe('QuantitConformalSelectorComponent', () => {
  let component: QuantitConformalSelectorComponent;
  let fixture: ComponentFixture<QuantitConformalSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantitConformalSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantitConformalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
