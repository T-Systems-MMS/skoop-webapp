import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Skill } from './skill';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private skillUrlPattern = `${environment.serverApiUrl}/skills/{skillId}`;

  constructor(private httpClient: HttpClient) { }

  getSkill(skillId: string): Observable<Skill> {
    return this.httpClient.get<Skill>(this.skillUrlPattern.replace('{skillId}', skillId));
  }
}
