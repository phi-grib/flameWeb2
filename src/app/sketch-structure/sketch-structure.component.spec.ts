import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchStructureComponent } from './sketch-structure.component';

describe('SketchStructureComponent', () => {
  let component: SketchStructureComponent;
  let fixture: ComponentFixture<SketchStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SketchStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
