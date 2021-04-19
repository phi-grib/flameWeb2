import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigStrainingComponent } from './config-straining.component';

describe('ConfigStrainingComponent', () => {
  let component: ConfigStrainingComponent;
  let fixture: ComponentFixture<ConfigStrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigStrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigStrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
