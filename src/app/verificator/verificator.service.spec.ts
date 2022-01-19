/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VerificatorService } from './verificator.service';

describe('Service: Verificator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerificatorService]
    });
  });

  it('should ...', inject([VerificatorService], (service: VerificatorService) => {
    expect(service).toBeTruthy();
  }));
});
