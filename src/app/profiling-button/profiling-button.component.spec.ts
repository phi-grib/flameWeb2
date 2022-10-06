import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilingButtonComponent } from './profiling-button.component';

describe('ProfilingButtonComponent', () => {
  let component: ProfilingButtonComponent;
  let fixture: ComponentFixture<ProfilingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilingButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
