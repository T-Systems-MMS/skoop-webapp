import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Community } from './community';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunitiesService {

  private communitiesUrlPattern = `${environment.serverApiUrl}/communities`;
  private communityUrlPattern = `${environment.serverApiUrl}/communities/{communityId}`;

  constructor(private httpClient: HttpClient) {
  }

  getCommunities(): Observable<Community[]> {
    return of([{
      id: '123',
      title: 'abcd',
      description: 'ewqe'
    },
      {
        id: '123456',
        title: 'abcdefg',
        description: 'ewqe'
      }]);//this.httpClient.get<Community[]>(this.communitiesUrlPattern);
  }

  getCommunity(communityId: string): Observable<Community> {
    return this.httpClient.get<Community>(this.communityUrlPattern.replace('{communityId}', communityId));
  }

  createCommunity(data: Community): Observable<Community> {
    return this.httpClient.post<Community>(this.communitiesUrlPattern, data);
  }

  updateCommunity(data: Community): Observable<Community> {
    return this.httpClient.put<Community>(this.communityUrlPattern.replace('{communityId}', data.id), data);
  }

  deleteCommunity(communityId: string): Observable<void> {
    return this.httpClient.delete<void>(this.communityUrlPattern.replace('{communityId}', communityId));
  }
}
