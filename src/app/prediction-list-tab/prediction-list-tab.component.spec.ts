import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionListTabComponent } from './prediction-list-tab.component';

describe('PredictionListTabComponent', () => {
  let component: PredictionListTabComponent;
  let fixture: ComponentFixture<PredictionListTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionListTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictionListTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
