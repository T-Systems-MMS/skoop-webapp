import { async, TestBed } from '@angular/core/testing';

import { ManagerService } from './manager.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentityService } from './user-identity.service';
import { UserIdentity } from './user-identity';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

describe('ManagerService', () => {
  let managerService: ManagerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ManagerService,
        {
          provide: UserIdentityService,
          useValue: jasmine.createSpyObj('userIdentityService', {'getUserIdentity': of(authenticatedUser)})
        }
      ]
    });

    managerService = TestBed.get(ManagerService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(managerService).toBeTruthy();
  });

  it('should provide the manager for the currently authenticated user', async(() => {
    const expectedManager = {
      id: '323285af-df9d-4e61-8e56-1b9895b36541',
      userName: 'manager',
      firstName: 'Name',
      lastName: 'Surname',
      email: 'manager@mail.com',
      phoneNumber: '1234567890'
    };

    managerService.getUserManager().subscribe(actualManager => {
      expect(actualManager).toEqual(expectedManager);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/manager`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(expectedManager);
  }));

  it('should provide the list of subordinates for the currently authenticated user', async(() => {
    const expectedSubordinates = [
      {
        id: '111285af-df9d-4e61-8e56-1b9895b36321',
        userName: 'user1',
        firstName: 'Name1',
        lastName: 'Surname1',
        email: 'user1@mail.com',
        phoneNumber: '1234567890'
      },
      {
        id: '323285af-df9d-4e61-8e56-1b9895b36541',
        userName: 'user2',
        firstName: 'Name2',
        lastName: 'Surname2',
        email: 'user2@mail.com',
        phoneNumber: '9876543221'
      }
    ];

    managerService.getSubordinates().subscribe(actualSubordinates => {
      expect(actualSubordinates).toEqual(expectedSubordinates);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/subordinates`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(expectedSubordinates);
  }));
});
