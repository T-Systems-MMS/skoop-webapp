import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommunityRequest } from './community-request';
import { CommunityResponse } from './community-response';

@Injectable({
  providedIn: 'root'
})
export class CommunitiesService {

  private communitiesUrlPattern = `${environment.serverApiUrl}/communities`;
  private communityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}`;

  constructor(private httpClient: HttpClient) {
  }

  getCommunities(): Observable<CommunityResponse[]> {
    return this.httpClient.get<CommunityResponse[]>(this.communitiesUrlPattern);
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
}
