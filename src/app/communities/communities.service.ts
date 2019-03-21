import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommunityRequest } from './community-request';
import { CommunityResponse } from './community-response';
import { UserIdentityService } from '../shared/user-identity.service';
import { switchMap } from 'rxjs/operators';
import { CommunityUserRequest } from './community-user-request';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';

@Injectable({
  providedIn: 'root'
})
export class CommunitiesService {

  private communitiesUrlPattern = `${environment.serverApiUrl}/communities`;
  private communityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}`;
  private joinCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/users`;
  private leaveCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/users/{userId}`;
  private registrationCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-registrations`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  getCommunities(): Observable<CommunityResponse[]> {
    return this.httpClient.get<CommunityResponse[]>(this.communitiesUrlPattern);
  }

  getRecommendedCommunities(): Observable<CommunityResponse[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        // todo: /users/{userId}/community-recommendations
        this.httpClient.get<CommunityResponse[]>(this.communitiesUrlPattern)));
  }

  getCommunity(communityId: string): Observable<CommunityResponse> {
    return this.httpClient.get<CommunityResponse>(this.communityUrlPattern.replace('{communityId}', communityId));
  }

  createCommunity(data: CommunityRequest): Observable<CommunityResponse> {
    return this.httpClient.post<CommunityResponse>(this.communitiesUrlPattern, data);
  }

  updateCommunity(data: CommunityRequest): Observable<CommunityResponse> {
    return this.httpClient.put<CommunityResponse>(this.communityUrlPattern.replace('{communityId}', data.id), data);
  }

  deleteCommunity(communityId: string): Observable<void> {
    return this.httpClient.delete<void>(this.communityUrlPattern.replace('{communityId}', communityId));
  }

  joinCommunity(communityId: string): Observable<CommunityResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<CommunityResponse>(
          this.joinCommunityUrlPattern.replace('{communityId}', communityId), { userId: userIdentity.userId } as CommunityUserRequest)));
  }

  leaveCommunity(communityId: string): Observable<CommunityResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.delete<CommunityResponse>(
          this.leaveCommunityUrlPattern.replace('{communityId}', communityId).replace('{userId}', userIdentity.userId))));
  }

  removeMember(communityId: string, userId: string): Observable<CommunityResponse> {
    return this.httpClient.delete<CommunityResponse>(
          this.leaveCommunityUrlPattern.replace('{communityId}', communityId).replace('{userId}', userId));
  }

  inviteUsers(communityId: string, userIds: string[]): Observable<CommunityUserRegistrationResponse[]> {
    return this.httpClient.post<CommunityUserRegistrationResponse[]>(this.registrationCommunityUrlPattern.replace('{communityId}', communityId),
      {userIds: userIds});
  }

}
