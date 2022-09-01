import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelListMultipleComponent } from './model-list-multiple.component';

describe('ModelListMultipleComponent', () => {
  let component: ModelListMultipleComponent;
  let fixture: ComponentFixture<ModelListMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelListMultipleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelListMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
