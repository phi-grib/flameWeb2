import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelListSelectorComponent } from './model-list-selector.component';

describe('ModelListSelectorComponent', () => {
  let component: ModelListSelectorComponent;
  let fixture: ComponentFixture<ModelListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelListSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
