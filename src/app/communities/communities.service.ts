import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommunityRequest } from './community-request';
import { CommunityResponse } from './community-response';
import { UserIdentityService } from '../shared/user-identity.service';
import { switchMap } from 'rxjs/operators';
import { CommunityUserRequest } from './community-user-request';
import { CommunityUserResponse } from './community-user-response';
import { CommunityRole } from './community-role.enum';

@Injectable({
  providedIn: 'root'
})
export class CommunitiesService {

  private communitiesUrlPattern = `${environment.serverApiUrl}/communities`;
  private communityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}`;
  private joinCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/users`;
  private leaveCommunityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/users/{userId}`;
  private userCommunitiesUrlPattern = `${environment.serverApiUrl}/users/{userId}/communities`;
  private recommendedCommunitiesUrlPattern = `${environment.serverApiUrl}/users/{userId}/community-recommendations`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  getCommunities(): Observable<CommunityResponse[]> {
    return this.httpClient.get<CommunityResponse[]>(this.communitiesUrlPattern);
  }

  getRecommendedCommunities(): Observable<CommunityResponse[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<CommunityResponse[]>(this.recommendedCommunitiesUrlPattern.replace('{userId}', userIdentity.userId))));
  }

  getCommunity(communityId: string): Observable<CommunityResponse> {
    return this.httpClient.get<CommunityResponse>(this.communityUrlPattern.replace('{communityId}', communityId));
  }

  getCommunityUsers(communityId: string, role: CommunityRole): Observable<CommunityUserResponse[]> {
    const params: HttpParams = new HttpParams();
    if (role) {
      params.append('role', role);
    }
    return this.httpClient.get<CommunityUserResponse[]>(this.joinCommunityUrlPattern.replace('{communityId}', communityId), {
      params: params
    });
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

  getUserCommunities(): Observable<CommunityResponse[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
          this.httpClient.get<CommunityResponse[]>(this.userCommunitiesUrlPattern.replace('{userId}', userIdentity.userId))));
  }

  joinCommunity(communityId: string): Observable<CommunityUserResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<CommunityUserResponse>(
          this.joinCommunityUrlPattern.replace('{communityId}', communityId), { userId: userIdentity.userId } as CommunityUserRequest)));
  }

  leaveCommunity(communityId: string): Observable<void> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.delete<void>(
          this.leaveCommunityUrlPattern.replace('{communityId}', communityId).replace('{userId}', userIdentity.userId))));
  }

  removeMember(communityId: string, userId: string): Observable<void> {
    return this.httpClient.delete<void>(
          this.leaveCommunityUrlPattern.replace('{communityId}', communityId).replace('{userId}', userId));
  }

}
