import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { User } from './user';
import { UserPermission } from './user-permission';
import { UserPermissionScope } from './user-permission-scope';
import { UsersService } from './users.service';
import { UserRequest } from './user-request';

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

const userRequestData: UserRequest = {
  userName: 'tester',
  academicDegree: 'academic degree',
  positionProfile: 'position profile',
  summary: 'summary',
  industrySectors: ['sector1', 'sector2', 'sector3'],
  specializations: ['specialization1, specialization2, specialization3'],
  certificates: ['certificate1', 'certificate2', 'certificate3'],
  languages: ['language1', 'language2', 'language2'],
  coach: true
};

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    spyOn(userIdentityServiceStub, 'getUserIdentity').and.returnValue(of(authenticatedUser));

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

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should provide the user profile for the currently authenticated user', async(() => {
    const testUser: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io',
      coach: true,
    };

    service.getUser().subscribe(user => {
      expect(user).toEqual(testUser);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(testUser);
  }));

  it('should provide the user profile for the given userId', async(() => {
    const testUser: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io',
      coach: true,
    };

    service.getUserById('e6b808eb-b6bd-447d-8dce-3e0d66b17759').subscribe(user => {
      expect(user).toEqual(testUser);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(testUser);
  }));

  it('should update the user profile for the currently authenticated user with the given data', async(() => {
    const testUser: User = {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io',
      academicDegree: 'academic degree',
      positionProfile: 'position profile',
      summary: 'summary',
      industrySectors: ['sector1', 'sector2', 'sector3'],
      specializations: ['specialization1', 'specialization2', 'specialization3'],
      certificates: ['certificate1', 'certificate2', 'certificate3'],
      languages: ['language1', 'language2', 'language2'],
      coach: true,
    };

    service.updateUser(userRequestData).subscribe(user => {
      expect(user).toEqual(testUser);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual(userRequestData);

    request.flush(testUser);
  }));

  it('should provide user suggestions for the given search term', async(() => {
    const testUsers: User[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.io',
        coach: true,
      },
      {
        id: '753cf4d3-863c-475d-8631-e68dffd1af2f',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@skoop.io',
        coach: false,
      }
    ];

    service.getUserSuggestions('test').subscribe((users) => {
      expect(users).toEqual(testUsers);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/user-suggestions`
      && req.params.get('search') === 'test'
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testUsers);
  }));

  it('should provide the users authorized by the currently authenticated user for the given scope', async(() => {
    const testUsers: User[] = [
      {
        id: '753cf4d3-863c-475d-8631-e68dffd1af2f',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@skoop.io',
        coach: false,
      },
      {
        id: '95470c7b-bf76-412a-b747-4448f4e11cc3',
        userName: 'testbed',
        firstName: 'Tabia',
        lastName: 'Testbed',
        email: 'tabia.testbed@skoop.io',
        coach: true,
      }
    ];
    const testPermissions: UserPermission[] = [
      {
        owner: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'tester',
          firstName: 'Toni',
          lastName: 'Tester',
          email: 'toni.tester@skoop.io',
          coach: true,
        },
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUsers: testUsers,
      }
    ];

    service.getPermissions().subscribe((permissions) => {
      expect(permissions).toEqual(testPermissions);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/outbound-permissions`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(testPermissions);
  }));

  it('should provide the users who have granted permission to the currently authenticated user', async(() => {
    const expectedOwners: User[] = [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'owner1',
        firstName: 'first',
        lastName: 'owner',
        email: 'first.owner@skoop.io',
        coach: true,
      },
      {
        id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
        userName: 'owner2',
        firstName: 'second',
        lastName: 'owner',
        email: 'second.owner@skoop.io',
        coach: true,
      }
    ];
    const testPermissions: UserPermission[] = [
      {
        owner: expectedOwners[0],
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUsers: [],
      },
      {
        owner: expectedOwners[1],
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUsers: [],
      }
    ];

    service.getPermissionOwners(UserPermissionScope.READ_USER_SKILLS).subscribe((owners) => {
      expect(owners).toEqual(expectedOwners);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/inbound-permissions`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(testPermissions);
  }));
});
