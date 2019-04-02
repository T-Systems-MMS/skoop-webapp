import { async, TestBed } from '@angular/core/testing';

import { CommunityUserService } from './community-user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { User } from '../users/user';

const communityId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';
const searchParam = 'test';

describe('CommunityUserService', () => {
  let httpTestingController: HttpTestingController;
  let communityUserService: CommunityUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityUserService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    communityUserService = TestBed.get(CommunityUserService);
  });

  it('should be created', () => {
    const service: CommunityUserService = TestBed.get(CommunityUserService);
    expect(service).toBeTruthy();
  });

  it('should not send request for empty search string', () => {
    const searchParam = '';
    communityUserService.getCommunityUserSuggestions(communityId, searchParam).subscribe(actualUsers => {
      expect(actualUsers.length).toBe(0);
    });

    httpTestingController.expectNone( `${environment.serverApiUrl}/communities/${communityId}/user-suggestions?search=${searchParam}`);
  });

  it('should suggest list of users according to the search param', () => {
    const expectedUsers: User[] = [
      {
        id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@myskills.io',
        coach: false,
      },
      {
        id: '251c2a3b-b737-4622-8060-196d5e297ebc',
        userName: 'testbed',
        firstName: 'Tabia',
        lastName: 'Testbed',
        email: 'tabia.testbed@myskills.io',
        coach: false,
      }
    ];

    communityUserService.getCommunityUserSuggestions(communityId, searchParam).subscribe(actualUsers => {
      expect(actualUsers.length).toBe(2);
      expect(actualUsers).toEqual(expectedUsers);
    });

    const req = httpTestingController.expectOne( `${environment.serverApiUrl}/communities/${communityId}/user-suggestions?search=${searchParam}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedUsers);
  });

  it('should provide list of users recommended for community', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    const recommendedUsersResponse: User[] = [{
      id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
      userName: 'testing',
      firstName: 'Tina',
      lastName: 'Testing',
      email: 'tina.testing@myskills.io',
      coach: false,
    },
      {
        id: '251c2a3b-b737-4622-8060-196d5e297ebc',
        userName: 'testbed',
        firstName: 'Tabia',
        lastName: 'Testbed',
        email: 'tabia.testbed@myskills.io',
        coach: false,
      }];

    communityUserService.getRecommendedUsers(communityId).subscribe((users) => {
      expect(users).toEqual(recommendedUsersResponse);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/communities/${communityId}/recommended-users`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(recommendedUsersResponse);
  }));
});
