import { TestBed, inject } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.get(UsersService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // both of below tests are equal
  it('should be created with inline inject', inject([UsersService], (usersService: UsersService) => {
    expect(usersService).toBeTruthy();
  }));
  it('should be created with global inject', () => {
    expect(service).toBeTruthy();
  });

});
