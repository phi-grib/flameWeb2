import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCompoundComponent } from './select-compound.component';

describe('SelectCompoundComponent', () => {
  let component: SelectCompoundComponent;
  let fixture: ComponentFixture<SelectCompoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCompoundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCompoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
