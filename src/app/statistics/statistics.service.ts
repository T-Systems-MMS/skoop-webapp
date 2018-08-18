import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserSkillPriorityAggregation } from './user-skill-priority-aggregation';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private topPrioritizedSkillsUrl = environment.serverApiUrl + '/statistics/skills/top-priority';

  constructor(private httpClient: HttpClient) { }

  getTopPrioritizedSkills(): Observable<UserSkillPriorityAggregation[]> {
    return this.httpClient.get<UserSkillPriorityAggregation[]>(this.topPrioritizedSkillsUrl);
  }
}
