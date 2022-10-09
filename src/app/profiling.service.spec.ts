import { TestBed } from '@angular/core/testing';

import { ProfilingService } from './profiling.service';

describe('ProfilingService', () => {
  let service: ProfilingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
