import { TestBed } from '@angular/core/testing';

import { SlammerEventService } from './slammer-event.service';

describe('SlammerEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlammerEventService = TestBed.get(SlammerEventService);
    expect(service).toBeTruthy();
  });
});
