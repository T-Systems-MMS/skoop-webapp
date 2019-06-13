import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ApproveUserProjectRequest } from './approve-user-project-request';
import { UserProject } from '../user-projects/user-project';

@Injectable({
  providedIn: 'root'
})
export class ProjectMembershipService {

  private approveAllUrlPattern = `${environment.serverApiUrl}/projects/{userId}/projects`;

  constructor(private httpClient: HttpClient) {
  }

  approveAll(userId: string, projects: ApproveUserProjectRequest[]): Observable<UserProject[]> {
    return this.httpClient.put<UserProject[]>(this.approveAllUrlPattern.replace('{userId}', userId), {projects: projects});
  }
}
