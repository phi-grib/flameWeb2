import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationsSelectorComponent } from './validations-selector.component';

describe('ValidationsSelectorComponent', () => {
  let component: ValidationsSelectorComponent;
  let fixture: ComponentFixture<ValidationsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationsSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
