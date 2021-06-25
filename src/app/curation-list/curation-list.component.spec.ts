import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurationListComponent } from './curation-list.component';

describe('CurationListComponent', () => {
  let component: CurationListComponent;
  let fixture: ComponentFixture<CurationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
