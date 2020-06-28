import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelerComponent } from './labeler.component';

describe('LabelerComponent', () => {
  let component: LabelerComponent;
  let fixture: ComponentFixture<LabelerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
