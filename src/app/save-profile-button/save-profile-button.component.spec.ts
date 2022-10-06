import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveProfileButtonComponent } from './save-profile-button.component';

describe('SaveProfileButtonComponent', () => {
  let component: SaveProfileButtonComponent;
  let fixture: ComponentFixture<SaveProfileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveProfileButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveProfileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
