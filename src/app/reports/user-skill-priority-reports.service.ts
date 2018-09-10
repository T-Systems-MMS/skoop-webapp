import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserSkillPriorityReportResponse } from './user-skill-priority-report-response';
import { UserSkillPriorityReportDetailsResponse } from './user-skill-priority-report-details-response';
import { SkillUser } from '../user-skills/skill-user';
import { Skill } from '../skills/skill';

@Injectable({
  providedIn: 'root'
})
export class UserSkillPriorityReportsService {

  private reportsUrl = `${environment.serverApiUrl}/reports`;

  private reportUrlPattern = `${environment.serverApiUrl}/reports/{reportId}`;
  private reportSkillUser = `${environment.serverApiUrl}/reports/{userSkillPriorityAggregationReportId}/users`;
  private skillUrlPattern = `${environment.serverApiUrl}/reports/skill/{skillId}`;

  constructor(private httpClient: HttpClient) { }

  getReports(): Observable<UserSkillPriorityReportResponse[]> {
    return this.httpClient.get<UserSkillPriorityReportResponse[]>(this.reportsUrl);
  }

  createRport(): Observable<UserSkillPriorityReportResponse> {

    console.log('this is createReport method');
    return this.httpClient.post<UserSkillPriorityReportResponse>(this.reportsUrl,
      null,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  getUserSkillPriorityReportDetails(reportId: string): Observable<UserSkillPriorityReportDetailsResponse[]> {
    return this.httpClient.get<UserSkillPriorityReportDetailsResponse[]>(this.reportUrlPattern.replace('{reportId}', reportId));
  }

  getUserSkillReportById(userSkillPriorityAggregationReportId: string): Observable<SkillUser[]> {
    return this.httpClient.get<SkillUser[]>(this.reportSkillUser
      .replace('{userSkillPriorityAggregationReportId}', userSkillPriorityAggregationReportId));
  }

  getSkill(skillId: string): Observable<Skill> {
    return this.httpClient.get<Skill>(this.skillUrlPattern.replace('{skillId}', skillId));
  }

}
