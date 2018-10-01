import { TestBed, inject, async } from '@angular/core/testing';

import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';
import { environment } from '../../environments/environment';

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    spyOn(userIdentityServiceStub, 'getUserIdentity').and.returnValue(of({
      userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      roles: ['ROLE_USER']
    }));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        { provide: UserIdentityService, useValue: userIdentityServiceStub }
      ]
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

  it('should provide the user skills requested via API with the given user ID', async(() => {
    const mockUserData: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'testername',
      lastName: 'testerfamily',
      email: 'tester@test.com',
      coach: true,
    };

    service.getUser().subscribe(user => {
      expect(user).toBeDefined();
      expect(user).toEqual(mockUserData);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/e6b808eb-b6bd-447d-8dce-3e0d66b17759`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(mockUserData);
  }));

  it('should update a user profile with the given data and provide the result', async(() => {
    const mockUserData: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'testername',
      lastName: 'testerfamily',
      email: 'tester@test.com',
      coach: true,
    };

    service.updateUser('tester', true).subscribe(userSkill => {
      expect(userSkill).toEqual(mockUserData);
      expect(userIdentityServiceStub.getUserIdentity).toHaveBeenCalled();
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/e6b808eb-b6bd-447d-8dce-3e0d66b17759`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual({
      userName: 'tester',
      coach: true,
    });

    request.flush(mockUserData);
  }));
});
