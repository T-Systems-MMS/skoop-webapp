import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SkillUser } from './skill-user';

@Injectable({
  providedIn: 'root'
})
export class SkillUsersService {
  private skillUsersUrlPattern = `${environment.serverApiUrl}/skills/{skillId}/users`;

  constructor(private httpClient: HttpClient) { }

  getSkillUsers(skillId: string, minPriority?: number): Observable<SkillUser[]> {
    let httpParams = new HttpParams();
    if (minPriority) {
      httpParams = httpParams.set('minPriority', minPriority.toString());
    }
    return this.httpClient.get<SkillUser[]>(this.skillUsersUrlPattern.replace('{skillId}', skillId),
      {
        params: httpParams
      });
  }
}
