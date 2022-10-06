import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualitConformalProfileComponent } from './qualit-conformal-profile.component';

describe('QualitConformalProfileComponent', () => {
  let component: QualitConformalProfileComponent;
  let fixture: ComponentFixture<QualitConformalProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualitConformalProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualitConformalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
