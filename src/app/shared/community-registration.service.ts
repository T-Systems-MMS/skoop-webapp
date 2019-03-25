import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { CommunityUserRegistrationResponse } from './community-user-registration-response';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommunityUserRegistration } from './community-user-registration';

@Injectable({
  providedIn: 'root'
})
export class CommunityRegistrationService {

  private registrationsCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-registrations`;
  private registrationCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-registrations/{registrationId}`;

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

}
