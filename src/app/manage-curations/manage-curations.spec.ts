import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageCurationsComponent } from './manage-curations';

describe('CuratorComponent', () => {
  let component: ManageCurationsComponent;
  let fixture: ComponentFixture<ManageCurationsComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
