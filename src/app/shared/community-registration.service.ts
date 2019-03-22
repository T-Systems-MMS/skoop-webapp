import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommunityUserRegistrationResponse } from './community-user-registration-response';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageStatus } from '../my-messages/message-status.enum';
import { CommunityType } from '../communities/community-type.enum';
import { CommunityRequest } from '../communities/community-request';
import { CommunityResponse } from '../communities/community-response';
import { CommunityUserRegistration } from './community-user-registration';

const response: CommunityUserRegistrationResponse[] = [
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
    approvedByCommunity: true,
    status: MessageStatus.PENDING,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
    creationDatetime: new Date()
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
    approvedByCommunity: true,
    status: MessageStatus.PENDING,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN
    },
    creationDatetime: new Date()
  }
];

@Injectable({
  providedIn: 'root'
})
export class CommunityRegistrationService {

  private registrationsCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-registrations`;
  private registrationCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-registrations/{registrationId}`;
  private registrationsUrlPattern = `${environment.serverApiUrl}/user-registrations`;

  constructor(private httpClient: HttpClient) {
  }

  inviteUsers(communityId: string, userIds: string[]): Observable<CommunityUserRegistrationResponse[]> {
    return this.httpClient.post<CommunityUserRegistrationResponse[]>(
      this.registrationsCommunityUrlPattern.replace('{communityId}', communityId),
      {userIds: userIds});
  }

  updateRegistration(communityId: string, data: CommunityUserRegistration): Observable<CommunityUserRegistrationResponse> {
    return this.httpClient.put<CommunityUserRegistrationResponse>(
      this.registrationCommunityUrlPattern
        .replace('{communityId}', communityId)
        .replace('{registrationId}', data.id),
      data);
  }

  getUserRegistrations(): Observable<CommunityUserRegistrationResponse[]> {
    return of(response);
    // return this.httpClient.get<CommunityUserRegistrationResponse[]>(this.registrationsUrlPattern);
  }
}
