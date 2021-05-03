import { TestBed } from '@angular/core/testing';

import { CuratorComponentService } from './curator-component.service';

describe('EditCuratedListService', () => {
  let service: CuratorComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuratorComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
