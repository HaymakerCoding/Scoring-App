import { TestBed } from '@angular/core/testing';

import { DoggieService } from './doggie.service';

describe('DoggieService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DoggieService = TestBed.get(DoggieService);
    expect(service).toBeTruthy();
  });
});
