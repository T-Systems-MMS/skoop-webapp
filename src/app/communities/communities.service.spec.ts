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
    const service: CommunitiesService = TestBed.get(CommunitiesService);
    expect(service).toBeTruthy();
  });

  it('should provide list of communities', async(() => {
    const testCommunities: CommunityResponse[] = [
      {
        id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
        title: 'test1',
        skills: [],
        description: 'description1',
        type: CommunityType.OPENED,
        links: [{
          name: 'google',
          href: 'https://www.google.com'
        },
          {
            name: 'stackoveflow',
            href: 'https://stackoverflow.com/'
          }],
        managers: [],
        members: []
      },
      {
        id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
        title: 'test2',
        skills: [],
        description: 'description2',
        type: CommunityType.OPENED,
        managers: [],
        members: []
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
      managerIds: ['asdasd34234234'],
      memberIds: ['dsf324df324']
    } as CommunityRequest;

    const testCommunityResponse: CommunityResponse = {
      id: testCommunity.id,
      title: testCommunity.title,
      description: testCommunity.description,
      links: testCommunity.links,
      managers: [{id: testCommunity.managerIds[0]}],
      members: [{id: testCommunity.memberIds[0]}]
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
      managerIds: ['asdasd34234234'],
      memberIds: ['dsf324df324']
    } as CommunityRequest;

    const testCommunityResponse: CommunityResponse = {
      id: testCommunityRequest.id,
      title: testCommunityRequest.title,
      description: testCommunityRequest.description,
      links: testCommunityRequest.links,
      managers: [{id: testCommunityRequest.managerIds[0]}],
      members: [{id: testCommunityRequest.memberIds[0]}]
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

    const testCommunityResponse: CommunityResponse = {
      id: communityId,
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
      managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}],
      members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
    } as CommunityResponse;

    const communityUserRequest: CommunityUserRequest = {
      userId: authenticatedUser.userId
    } as CommunityUserRequest;

    service.joinCommunity(communityId).subscribe((response: CommunityResponse) => {
      expect(response).toEqual(testCommunityResponse);
    });

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/communities/${communityId}/users`
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(communityUserRequest);

    req.flush(testCommunityResponse);
  }));

  it('should make user leave a community', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    const testCommunityResponse: CommunityResponse = {
      id: communityId,
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
      managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}],
      members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
    } as CommunityResponse;

    service.leaveCommunity(communityId).subscribe((data: any) => {
      expect(data).toEqual(testCommunityResponse);
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/communities/${communityId}/users/${authenticatedUser.userId}`
    });
    expect(req.request.method).toBe('DELETE');

    req.flush(testCommunityResponse);
  }));

  it('should kick out a community member', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    const memberId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17666';
    const testCommunityResponse: CommunityResponse = {
      id: communityId,
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
      managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}],
      members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
    } as CommunityResponse;

    service.removeMember(communityId, memberId).subscribe((data: any) => {
      expect(data).toEqual(testCommunityResponse);
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/communities/${communityId}/users/${memberId}`
    });
    expect(req.request.method).toBe('DELETE');

    req.flush(testCommunityResponse);
  }));

});
