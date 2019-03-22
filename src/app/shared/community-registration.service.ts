import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityUserRegistrationResponse } from './community-user-registration-response';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommunityRegistrationService {

  private registrationCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-registrations`;

  constructor(private httpClient: HttpClient) {
  }

  inviteUsers(communityId: string, userIds: string[]): Observable<CommunityUserRegistrationResponse[]> {
    return this.httpClient.post<CommunityUserRegistrationResponse[]>(
      this.registrationCommunityUrlPattern.replace('{communityId}', communityId),
      {userIds: userIds});
  }
}
