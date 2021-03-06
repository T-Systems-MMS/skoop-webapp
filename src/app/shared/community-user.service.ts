import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../users/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityUserService {

  private communityUserSuggestionUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/user-suggestions`;
  private recommendedUsersUrlPattern = `${environment.serverApiUrl}/communities/{communityId}/recommended-users`;

  constructor(private httpClient: HttpClient) {
  }

  getCommunityUserSuggestions(communityId: string, search: string): Observable<User[]> {
    if (!search) { return of([]); }
    return this.httpClient.get<User[]>(this.communityUserSuggestionUrlPattern.replace('{communityId}', communityId),
      {
        params: new HttpParams().set('search', search)
      });
  }

  getRecommendedUsers(communityId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(this.recommendedUsersUrlPattern.replace('{communityId}', communityId));
  }
}
