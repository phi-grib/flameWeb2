import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificatorComponent } from './verificator.component';

describe('VerificatorComponent', () => {
  let component: VerificatorComponent;
  let fixture: ComponentFixture<VerificatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
