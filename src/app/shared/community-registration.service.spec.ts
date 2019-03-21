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

    const testCommunityResponse: CommunityUserRegistrationResponse[] = [
      {
        user: {
          id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
          userName: 'first user'
        },
        approvedByUser: false,
        approvedByCommunity: true
      },
      {
        user: {
          id: 'e11235ab-f13e-4fd6-b5d6-9c4c4e18aa6g',
          userName: 'second user'
        },
        approvedByUser: false,
        approvedByCommunity: true
      }
    ];

    communityRegistrationService.inviteUsers(communityId, userIds).subscribe(community => {
      expect(community).toEqual(testCommunityResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/communities/${communityId}/user-registrations`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual({userIds: userIds});

    request.flush(testCommunityResponse);
  }));
});
