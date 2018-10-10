import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { SkillGroup } from './skill-group';
@Injectable({
  providedIn: 'root'
})
export class SkillGroupsService {

  private groupUrl = `${environment.serverApiUrl}/groups`;
  private groupUrlPattern = `${environment.serverApiUrl}/groups/{groupId}`;
  private skillGroupExistenceUrlPattern = `${environment.serverApiUrl}/groups/group-existence`;

  private userSkillSuggestionsUrlPatternBySkillId = `${environment.serverApiUrl}/skills/{skillId}/group-suggestions`;
  private userSkillSuggestionsUrlPattern = `${environment.serverApiUrl}/group-suggestions`;

  constructor(private httpClient: HttpClient) { }

  getSkillGroupSuggestions(search: string): Observable<string[]> {
    if (!search) { return of([]); }
    return this.httpClient.get<string[]>(this.userSkillSuggestionsUrlPattern,
      {
        params: new HttpParams().set('search', search)
      });
  }

  getGroup(groupId: string): Observable<SkillGroup> {
    return this.httpClient.get<SkillGroup>(this.groupUrlPattern.replace('{groupId}', groupId));
  }

  getAllGroups(): Observable<SkillGroup[]> {
    return this.httpClient.get<SkillGroup[]>(this.groupUrl);
  }

  createGroup(name: string, description: string): Observable<SkillGroup> {
    return this.httpClient.post<SkillGroup>(this.groupUrl,
      {
        name,
        description
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  updateGroup(groupId: string, name: string, description: string): Observable<SkillGroup> {
    return this.httpClient.put<SkillGroup>(this.groupUrlPattern.replace('{groupId}', groupId),
      {
        name,
        description
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.httpClient.delete<void>(this.groupUrlPattern.replace('{groupId}', groupId));
  }

  isGroupExist(search: string): Observable<boolean> {
    if (!search) { return of(false); }
    return this.httpClient.get<boolean>(this.skillGroupExistenceUrlPattern,
      {
        params: new HttpParams().set('search', search)
      });
  }

}
