import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpaceListComponent } from './space-list.component';

describe('SearchListComponent', () => {
  let component: SpaceListComponent;
  let fixture: ComponentFixture<SpaceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
