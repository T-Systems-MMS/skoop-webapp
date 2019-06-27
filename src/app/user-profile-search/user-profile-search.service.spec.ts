import { TestBed } from '@angular/core/testing';

import { UserProfileSearchService } from './user-profile-search.service';

describe('UserProfileSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserProfileSearchService = TestBed.get(UserProfileSearchService);
    expect(service).toBeTruthy();
  });
});
