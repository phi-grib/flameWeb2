import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSseriesComponent } from './training-sseries.component';

describe('TrainingSseriesComponent', () => {
  let component: TrainingSseriesComponent;
  let fixture: ComponentFixture<TrainingSseriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingSseriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingSseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
