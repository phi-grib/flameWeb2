import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionMultipleComponent } from './prediction-multiple.component';

describe('PredictionMultipleComponent', () => {
  let component: PredictionMultipleComponent;
  let fixture: ComponentFixture<PredictionMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
