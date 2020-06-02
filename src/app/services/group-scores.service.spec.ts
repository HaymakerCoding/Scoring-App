import { TestBed } from '@angular/core/testing';

import { GroupScoresService } from './group-scores.service';

describe('GroupScoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupScoresService = TestBed.get(GroupScoresService);
    expect(service).toBeTruthy();
  });
});
