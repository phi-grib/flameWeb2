import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadProfileButtonComponent } from './load-profile-button.component';

describe('LoadProfileButtonComponent', () => {
  let component: LoadProfileButtonComponent;
  let fixture: ComponentFixture<LoadProfileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadProfileButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadProfileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
