import { async, TestBed } from '@angular/core/testing';

import { CommunitiesService } from './communities.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { CommunityType } from './community-type.enum';
import { CommunityResponse } from './community-response';
import { CommunityRequest } from './community-request';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { CommunityUserRequest } from './community-user-request';
import { CommunityUserResponse } from './community-user-response';
import { CommunityRole } from './community-role.enum';
import { User } from '../users/user';
import { CommunityUserRoleRequest } from '../community-view/community-user-role-request';

describe('CommunitiesService', () => {
  let httpTestingController: HttpTestingController;
  let service: CommunitiesService;

  const authenticatedUser: UserIdentity = {
    userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'tester',
    firstName: 'Toni',
    lastName: 'Tester',
    email: 'toni.tester@myskills.io',
    roles: ['ROLE_USER']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunitiesService,
        { provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })}
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CommunitiesService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const communitiesService: CommunitiesService = TestBed.get(CommunitiesService);
    expect(communitiesService).toBeTruthy();
  });

  it('should provide list of communities', async(() => {
    const testCommunities: CommunityResponse[] = [
      {
        id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
        title: 'test1',
        skills: [],
        description: 'description1',
        type: CommunityType.OPEN,
        links: [{
          name: 'google',
          href: 'https://www.google.com'
        },
          {
            name: 'stackoveflow',
            href: 'https://stackoverflow.com/'
          }],
        managers: []
      },
      {
        id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
        title: 'test2',
        skills: [],
        description: 'description2',
        type: CommunityType.OPEN,
        managers: []
      }
    ];

    service.getCommunities().subscribe((communities) => {
      expect(communities).toEqual(testCommunities);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/communities`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testCommunities);
  }));

  it('should provide list of recommended communities', async(() => {
    const testCommunities: CommunityResponse[] = [
      {
        id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
        title: 'test1',
        skills: [],
        description: 'description1',
        type: CommunityType.OPEN,
        links: [{
          name: 'google',
          href: 'https://www.google.com'
        },
          {
            name: 'stackoveflow',
            href: 'https://stackoverflow.com/'
          }],
        managers: []
      },
      {
        id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
        title: 'test2',
        skills: [],
        description: 'description2',
        type: CommunityType.OPEN,
        managers: []
      }
    ];

    service.getRecommendedCommunities().subscribe((communities) => {
      expect(communities).toEqual(testCommunities);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/users/${authenticatedUser.userId}/community-recommendations`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testCommunities);
  }));

  it('should provide a community', async(() => {
    const testCommunity: CommunityResponse = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      skills: [],
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }]
    } as CommunityResponse;

    service.getCommunity(testCommunity.id).subscribe((community) => {
      expect(community).toEqual(testCommunity);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/communities/${testCommunity.id}`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testCommunity);
  }));

  it('should update the community with the given data', async(() => {
    const testCommunity: CommunityRequest = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }],
      invitedUserIds: ['asdasd34234234']
    } as CommunityRequest;

    const testCommunityResponse: CommunityResponse = {
      id: testCommunity.id,
      title: testCommunity.title,
      description: testCommunity.description,
      links: testCommunity.links,
      managers: []
    } as CommunityResponse;

    service.updateCommunity(testCommunity).subscribe(community => {
      expect(community).toEqual(testCommunityResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/communities/${testCommunity.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(testCommunity);

    request.flush(testCommunityResponse);
  }));

  it('should create the community with the given data', async(() => {
    const testCommunityRequest: CommunityRequest = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }],
      invitedUserIds: ['asdasd34234234']
    } as CommunityRequest;

    const testCommunityResponse: CommunityResponse = {
      id: testCommunityRequest.id,
      title: testCommunityRequest.title,
      description: testCommunityRequest.description,
      links: testCommunityRequest.links,
      managers: [{id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'}]
    } as CommunityResponse;

    service.createCommunity(testCommunityRequest).subscribe(community => {
      expect(community).toEqual(testCommunityResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/communities`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(testCommunityRequest);

    request.flush(testCommunityResponse);
  }));

  it('should delete the community', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    service.deleteCommunity(communityId).subscribe((data: any) => {
      expect(data).toBe(communityId);
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/communities/${communityId}`
    });
    expect(req.request.method).toBe('DELETE');

    req.flush(communityId);
  }));

  it('should make user join a community', async(() => {

    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';

    const testCommunityUserResponse: CommunityUserResponse = {
      role: CommunityRole.MEMBER,
      user: {
        id: authenticatedUser.userId,
        userName: authenticatedUser.userName
      } as User
    } as CommunityUserResponse;

    const communityUserRequest: CommunityUserRequest = {
      userId: authenticatedUser.userId
    } as CommunityUserRequest;

    service.joinCommunity(communityId).subscribe((response: CommunityUserResponse) => {
      expect(response).toEqual(testCommunityUserResponse);
    });

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/communities/${communityId}/users`
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(communityUserRequest);

    req.flush(testCommunityUserResponse);
  }));

  it('should make user leave a community', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    service.leaveCommunity(communityId).subscribe((data: any) => {
      expect(data).toBeUndefined();
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/communities/${communityId}/users/${authenticatedUser.userId}`
    });
    expect(req.request.method).toBe('DELETE');
  }));

  it('should kick out a community member', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    const memberId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17666';

    service.removeMember(communityId, memberId).subscribe((data: any) => {
      expect(data).toBeUndefined();
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/communities/${communityId}/users/${memberId}`
    });
    expect(req.request.method).toBe('DELETE');
  }));

  it('should fetch user communities', async(() => {
    const communities: CommunityResponse[] = [
      {
        id: '123',
        title: 'Java User Group',
        type: CommunityType.OPEN
      } as CommunityResponse,
      {
        id: '456',
        title: 'Scala User Group'
      } as CommunityResponse
    ];

    service.getUserCommunities().subscribe((response) => {
      expect(response).toBe(communities);
    });

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/communities`
    });
    expect(req.request.method).toBe('GET');
  }));

  it('should change a member role', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    const memberId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17666';
    const updateRoleData: CommunityUserRoleRequest =  {
      role: CommunityRole.MANAGER
    };

    const expectedResponse: CommunityUserResponse = {
        user: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666',
          userName: 'tester',
          firstName: 'test',
          lastName: 'tester'
        } as User,
        role: CommunityRole.MANAGER
      };

    service.changeUserRole(communityId, memberId, updateRoleData).subscribe((data: any) => {
      expect(data).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/communities/${communityId}/users/${memberId}`
    });
    expect(req.request.method).toBe('PUT');
    req.flush(expectedResponse);
  }));

});
