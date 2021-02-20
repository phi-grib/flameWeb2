import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCuratedListComponent } from './edit-curated-list.component';

describe('EditCuratedListComponent', () => {
  let component: EditCuratedListComponent;
  let fixture: ComponentFixture<EditCuratedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCuratedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCuratedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
