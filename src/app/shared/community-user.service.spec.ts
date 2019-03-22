import { TestBed } from '@angular/core/testing';

import { CommunityUserService } from './community-user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { User } from '../users/user';

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

  it('should suggest list of users according to the search param', () => {
    const communityId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';
    const searchParam = 'test';

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

    communityUserService.getCommunityUserSuggestions(communityId,'test').subscribe(actualUsers => {
      expect(actualUsers.length).toBe(2);
      expect(actualUsers).toEqual(expectedUsers);
    });

    const req = httpTestingController.expectOne( `${environment.serverApiUrl}/communities/${communityId}/user-suggestions?search=${searchParam}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedUsers);
  });
});
