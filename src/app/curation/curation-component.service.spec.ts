import { TestBed } from '@angular/core/testing';

import { CurationComponentService} from './curation-component.service';

describe('CurationDocumentationService', () => {
  let service: CurationComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurationComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
