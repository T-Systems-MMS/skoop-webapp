import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { Skill } from './skill';
import { UserIdentityService } from '../shared/user-identity.service';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private skillUrl = `${environment.serverApiUrl}/skills`;
  private skillUrlPattern = `${environment.serverApiUrl}/skills/{skillId}`;
  private userSkillExistenceUrlPattern = `${environment.serverApiUrl}/skills/skill-existence`;

  constructor(private httpClient: HttpClient,
    private userIdentityService: UserIdentityService) { }

  getSkill(skillId: string): Observable<Skill> {
    return this.httpClient.get<Skill>(this.skillUrlPattern.replace('{skillId}', skillId));
  }

  getAllSkills(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(this.skillUrl);
  }

  createSkill(name: string, description: string, selectedGroups: Set<string>): Observable<Skill> {
    const skillGroups = Array.from(selectedGroups);
    return this.httpClient.post<Skill>(this.skillUrl,
      {
        name,
        description,
        skillGroups
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  updateSkill(skillId: string, name: string, description: string, selectedGroups: Set<string>): Observable<Skill> {
    const skillGroups = Array.from(selectedGroups);
    return this.httpClient.put<Skill>(this.skillUrlPattern.replace('{skillId}', skillId),
      {
        name,
        description,
        skillGroups
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  deleteSkill(skillId: string): Observable<void> {
    return this.httpClient.delete<void>(this.skillUrlPattern.replace('{skillId}', skillId));
  }

  isSkillExist(search: string): Observable<boolean> {
    if (!search) { return of(false); }
    return this.httpClient.get<boolean>(this.userSkillExistenceUrlPattern,
      {
        params: new HttpParams().set('search', search)
      });
  }

}
