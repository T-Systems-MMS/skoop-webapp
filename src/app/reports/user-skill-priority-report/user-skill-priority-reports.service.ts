import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserSkillPriorityReportSimple } from './user-skill-priority-report-simple';
import { UserSkillPriorityReport } from './user-skill-priority-report';
import { UserSkillReport } from '../shared/user-skill-report';

@Injectable({
  providedIn: 'root'
})
export class UserSkillPriorityReportsService {

  private reportsUrl = `${environment.serverApiUrl}/reports/skills/priority`;
  private reportUrlPattern = `${environment.serverApiUrl}/reports/skills/priority/{reportId}`;
  private userSkillReportsUrlPattern =
    `${environment.serverApiUrl}/reports/skills/priority/{reportId}/aggregations/{aggregationReportId}/users`;

  constructor(private httpClient: HttpClient) { }

  getReports(): Observable<UserSkillPriorityReportSimple[]> {
    return this.httpClient.get<UserSkillPriorityReportSimple[]>(this.reportsUrl);
  }

  createReport(): Observable<UserSkillPriorityReportSimple> {
    return this.httpClient.post<UserSkillPriorityReportSimple>(this.reportsUrl,
      null,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

  getReportDetails(reportId: string): Observable<UserSkillPriorityReport> {
    return this.httpClient.get<UserSkillPriorityReport>(this.reportUrlPattern.replace('{reportId}', reportId));
  }

  getUserSkillReportsByAggregationReportId(reportId: string, aggregationReportId: string): Observable<UserSkillReport[]> {
    return this.httpClient.get<UserSkillReport[]>(this.userSkillReportsUrlPattern
      .replace('{reportId}', reportId)
      .replace('{aggregationReportId}', aggregationReportId));
  }

}
