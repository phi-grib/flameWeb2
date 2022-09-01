import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSelectionComponent } from './current-selection.component';

describe('CurrentSelectionComponent', () => {
  let component: CurrentSelectionComponent;
  let fixture: ComponentFixture<CurrentSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
