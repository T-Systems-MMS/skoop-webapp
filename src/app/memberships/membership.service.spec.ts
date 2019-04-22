import { async, TestBed } from '@angular/core/testing';

import { MembershipService } from './membership.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { MembershipRequest } from './membership-request';
import { MembershipResponse } from './membership-response';
import { environment } from '../../environments/environment';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

describe('MembershipService', () => {
  let httpTestingController: HttpTestingController;
  let membershipService: MembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MembershipService,
        {
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })
        }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    membershipService = TestBed.get(MembershipService);
  });

  it('should be created', () => {
    expect(membershipService).toBeTruthy();
  });

  it('should create the membership with the given data', async(() => {
    const membershipRequest: MembershipRequest = {
      name: 'membership name',
      additionalInformation: 'Additional Information',
      link: 'https://www.google.com',
      skills: ['Skill1', 'Skill2']
    };

    const membershipResponse: MembershipResponse = {
      id: '123123123123123',
      name: membershipRequest.name,
      additionalInformation: membershipRequest.additionalInformation,
      link: membershipRequest.link,
      skills: [
        {
          id: '1231231',
          name: 'Skill1'
        },
        {
          id: '4325345345',
          name: 'Skill2'
        },
      ]
    };

    membershipService.createMembership(membershipRequest).subscribe(actualData => {
      expect(actualData).toEqual(membershipResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/memberships`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(membershipRequest);

    request.flush(membershipResponse);
  }));

  it('should provide list of memberships', async(() => {
    const membershipResponses: MembershipResponse[] = [
      {
        id: '18a30b9b-7d0d-4e50-a953-c643e085e071',
        name: 'Membership name',
        additionalInformation: 'Additional Information',
        link: 'https://www.google.com',
        'skills': []
      },
      {
        id: '369710e0-5808-4318-961e-0161f9f81f1c',
        name: 'Updated name',
        additionalInformation: 'Updated Additional Information',
        link: null,
        skills: [
          {
            id: '1f5082a3-f7cf-4d6b-ad41-df8bce06e03f',
            name: 'Java',
            description: 'Java programming language.',
            skillGroups: null
          }
        ]
      }
    ];

    membershipService.getMemberships().subscribe(actualData => {
      expect(actualData).toEqual(membershipResponses);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/memberships`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(membershipResponses);
  }));

  it('should update the membership with the given data', async(() => {
    const membershipRequest: MembershipRequest = {
      id: '369710e0-5808-4318-961e-0161f9f81f1c',
      name: 'Updated name',
      additionalInformation: 'Updated Additional Information',
      link: null,
      skills: ['Java']
    };

    const membershipResponse: MembershipResponse = {
      id: membershipRequest.id,
      name: membershipRequest.name,
      additionalInformation: membershipRequest.additionalInformation,
      link: membershipRequest.link,
      skills: [
        {
          id: '1231231',
          name: 'Skill1'
        },
        {
          id: '4325345345',
          name: 'Skill2'
        },
      ]
    };

    membershipService.editMembership(membershipRequest).subscribe(actualData => {
      expect(actualData).toEqual(membershipResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/memberships/${membershipRequest.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(membershipRequest);

    request.flush(membershipResponse);
  }));

  it('should delete the membership by its id', async(() => {
    const membershipId = '1231242134134124';
    membershipService.deleteMembership(membershipId).subscribe(actualData => {
      expect(actualData).toBeNull();
    });

    const request = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/memberships/${membershipId}`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(null);
  }));
});
