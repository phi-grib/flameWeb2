import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualitConformalSelectorComponent } from './qualit-conformal-selector.component';

describe('QualitConformalSelectorComponent', () => {
  let component: QualitConformalSelectorComponent;
  let fixture: ComponentFixture<QualitConformalSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualitConformalSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualitConformalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
