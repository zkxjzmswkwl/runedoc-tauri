import { TestBed } from '@angular/core/testing';

import { AfkwardenService } from './afkwarden.service';

describe('AfkwardenService', () => {
  let service: AfkwardenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfkwardenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
