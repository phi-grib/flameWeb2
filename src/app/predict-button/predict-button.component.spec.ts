import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictButtonComponent } from './predict-button.component';

describe('PredictButtonComponent', () => {
  let component: PredictButtonComponent;
  let fixture: ComponentFixture<PredictButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
