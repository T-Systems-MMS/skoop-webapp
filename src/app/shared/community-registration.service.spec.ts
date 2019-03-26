import { async, TestBed } from '@angular/core/testing';

import { CommunityRegistrationService } from './community-registration.service';
import { CommunityUserRegistrationResponse } from './community-user-registration-response';
import { environment } from '../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CommunityRegistrationService', () => {
  let httpTestingController: HttpTestingController;
  let communityRegistrationService: CommunityRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunityRegistrationService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    communityRegistrationService = TestBed.get(CommunityRegistrationService);
  });

  it('should be created', () => {
    const service: CommunityRegistrationService = TestBed.get(CommunityRegistrationService);
    expect(service).toBeTruthy();
  });

  it('should send an invitation request', async(() => {
    const userIds: string[] = ['d11235de-f13e-4fd6-b5d6-9c4c4e18aa4f', 'e11235ab-f13e-4fd6-b5d6-9c4c4e18aa6g'];
    const communityId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';

    const communityUserRegistrationResponse: CommunityUserRegistrationResponse[] = [
      {
        id: '12345',
        user: {
          id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
          userName: 'testing',
          firstName: 'Tina',
          lastName: 'Testing',
          email: 'tina.testing@myskills.io',
          coach: false,
        },
        approvedByUser: false,
        approvedByCommunity: true
      },
      {
        id: '567890',
        user: {
          id: '251c2a3b-b737-4622-8060-196d5e297ebc',
          userName: 'testbed',
          firstName: 'Tabia',
          lastName: 'Testbed',
          email: 'tabia.testbed@myskills.io',
          coach: false,
        },
        approvedByUser: false,
        approvedByCommunity: true
      }
    ];

    communityRegistrationService.inviteUsers(communityId, userIds).subscribe(community => {
      expect(community).toEqual(communityUserRegistrationResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/communities/${communityId}/user-registrations`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual({userIds: userIds});

    request.flush(communityUserRegistrationResponse);
  }));
});