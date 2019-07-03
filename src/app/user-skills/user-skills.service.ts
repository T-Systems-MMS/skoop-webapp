import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserSkill } from './user-skill';
import { User } from '../users/user';
import { UpdateUserSkillRequest } from '../my-skills/update-user-skill-request';

@Injectable({
  providedIn: 'root'
})
export class UserSkillsService {
  private userSkillsUrlPattern = `${environment.serverApiUrl}/users/{userId}/skills`;
  private userSkillUrlPattern = `${environment.serverApiUrl}/users/{userId}/skills/{skillId}`;
  private userSkillCoachesUrlPattern = `${environment.serverApiUrl}/users/{userId}/skills/{skillId}/coaches`;
  private userSkillSuggestionsUrlPattern = `${environment.serverApiUrl}/users/{userId}/skill-suggestions`;

  constructor(private httpClient: HttpClient) { }

  getUserSkills(userId: string): Observable<UserSkill[]> {
    return this.httpClient.get<UserSkill[]>(this.userSkillsUrlPattern.replace('{userId}', userId));
  }

  getUserSkillCoaches(userId: string, skillId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(this.userSkillCoachesUrlPattern.replace('{userId}', userId).replace('{skillId}', skillId));
  }

  getUserSkillSuggestions(userId: string, search: string): Observable<string[]> {
    if (!search) { return of([]); }
    return this.httpClient.get<string[]>(this.userSkillSuggestionsUrlPattern.replace('{userId}', userId),
      {
        params: new HttpParams().set('search', search)
      });
  }

  createUserSkill(userId: string, skillName: string, currentLevel: number, desiredLevel: number, priority: number): Observable<UserSkill> {
    return this.httpClient.post<UserSkill>(this.userSkillsUrlPattern.replace('{userId}', userId),
      {
        skillName,
        currentLevel,
        desiredLevel,
        priority
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  updateUserSkill(userId: string, skillId: string, requestData: UpdateUserSkillRequest): Observable<UserSkill> {
    return this.httpClient.put<UserSkill>(this.userSkillUrlPattern.replace('{userId}', userId).replace('{skillId}', skillId),
      requestData);
  }

  deleteUserSkill(userId: string, skillId: string): Observable<void> {
    return this.httpClient.delete<void>(this.userSkillUrlPattern.replace('{userId}', userId).replace('{skillId}', skillId));
  }
}
