import { TestBed } from '@angular/core/testing';

import { SearchUsersService } from './search-users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SearchUsersService', () => {
  let httpTestingController: HttpTestingController;
  let service: SearchUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchUsersService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SearchUsersService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: SearchUsersService = TestBed.get(SearchUsersService);
    expect(service).toBeTruthy();
  });
});
