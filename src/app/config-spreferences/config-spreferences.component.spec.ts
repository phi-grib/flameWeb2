import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigSpreferencesComponent } from './config-spreferences.component';

describe('ConfigSpreferencesComponent', () => {
  let component: ConfigSpreferencesComponent;
  let fixture: ComponentFixture<ConfigSpreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigSpreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigSpreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
