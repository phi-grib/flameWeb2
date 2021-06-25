import { TestBed } from '@angular/core/testing';

import { ManageCurationsService } from './manage-curations.service';

describe('CuratorService', () => {
  let service: ManageCurationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCurationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
