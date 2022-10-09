import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePredProfComponent } from './manage-pred-prof.component';

describe('ManagePredProfComponent', () => {
  let component: ManagePredProfComponent;
  let fixture: ComponentFixture<ManagePredProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePredProfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePredProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
