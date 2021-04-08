import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurationDocumentationComponent } from './curation-documentation.component';

describe('CurationDocumentationComponent', () => {
  let component: CurationDocumentationComponent;
  let fixture: ComponentFixture<CurationDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurationDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurationDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
