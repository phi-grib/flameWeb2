import { TestBed } from '@angular/core/testing';

import { CurationDocumentationService } from './curation-documentation.service';

describe('CurationDocumentationService', () => {
  let service: CurationDocumentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurationDocumentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
