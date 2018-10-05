import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserSkillPriorityReportMetaData } from './user-skill-priority-report-meta-data';
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

  getReports(): Observable<UserSkillPriorityReportMetaData[]> {
    return this.httpClient.get<UserSkillPriorityReportMetaData[]>(this.reportsUrl);
  }

  createReport(): Observable<UserSkillPriorityReportMetaData> {
    return this.httpClient.post<UserSkillPriorityReportMetaData>(this.reportsUrl,
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
