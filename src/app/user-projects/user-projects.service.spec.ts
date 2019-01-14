import { TestBed } from '@angular/core/testing';

import { UserProjectsService } from './user-projects.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserProjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: UserProjectsService = TestBed.get(UserProjectsService);
    expect(service).toBeTruthy();
  });
});
