import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { UserIdentityService } from './user-identity.service';
import { UserIdentity } from './user-identity';

describe('UserIdentityService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserIdentityService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([UserIdentityService], (service: UserIdentityService) => {
    expect(service).toBeTruthy();
  }));

  it('should provide the user identity returned by the server',
    async(inject([UserIdentityService], (service: UserIdentityService) => {
      const userIdentityTestData: UserIdentity = {
        userId: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@myskills.io',
        roles: ['ROLE_ADMIN', 'ROLE_USER']
      };

      service.getUserIdentity().subscribe(userIdentity => {
        expect(userIdentity).toEqual(userIdentityTestData);
      });

      const request = httpTestingController.expectOne({ method: 'GET', url: '/api/my-identity' });

      expect(request.request.responseType).toEqual('json');

      request.flush(userIdentityTestData);
    })));

  it('should provide the cached user identity without calling the server again',
    async(inject([UserIdentityService], (service: UserIdentityService) => {
      const userIdentityTestData: UserIdentity = {
        userId: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@myskills.io',
        roles: ['ROLE_ADMIN', 'ROLE_USER']
      };

      service.getUserIdentity().subscribe(() => {
        service.getUserIdentity().subscribe(userIdentity => {
          expect(userIdentity).toEqual(userIdentityTestData);
        });
      });

      const request = httpTestingController.expectOne({ method: 'GET', url: '/api/my-identity' });

      expect(request.request.responseType).toEqual('json');

      request.flush(userIdentityTestData);
    })));
});
