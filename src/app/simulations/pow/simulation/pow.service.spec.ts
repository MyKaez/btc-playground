import { TestBed } from '@angular/core/testing';

import { PowService } from './pow.service';

describe('PowService', () => {
  let service: PowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
