import { TestBed } from '@angular/core/testing';

import { EditCuratedListService } from './edit-curated-list.service';

describe('EditCuratedListService', () => {
  let service: EditCuratedListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditCuratedListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
