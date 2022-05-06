import { TestBed } from '@angular/core/testing';

import { WanderDataService } from './wander-data.service';

describe('WanderDataService', () => {
  let service: WanderDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WanderDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
