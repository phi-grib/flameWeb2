import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbuilderComponent } from './sbuilder.component';

describe('SbuilderComponent', () => {
  let component: SbuilderComponent;
  let fixture: ComponentFixture<SbuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
