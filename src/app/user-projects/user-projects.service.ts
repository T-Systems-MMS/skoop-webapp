import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserProject } from './user-project';
import { AssignUserProjectRequest } from './assign-user-project-request';
import { UpdateUserProjectRequest } from './update-user-project-request';

@Injectable({
  providedIn: 'root'
})
export class UserProjectsService {

  private userProjectsUrlPattern = `${environment.serverApiUrl}/users/{userId}/projects`;
  private userProjectUrlPattern = `${environment.serverApiUrl}/users/{userId}/projects/{projectId}`;

  constructor(private httpClient: HttpClient) { }

  getUserProjects(userId: string): Observable<UserProject[]> {
    return this.httpClient.get<UserProject[]>(this.userProjectsUrlPattern.replace('{userId}', userId));
  }

  assignProjectToUser(userId: string, request: AssignUserProjectRequest): Observable<UserProject> {
    return this.httpClient.post<UserProject>(this.userProjectsUrlPattern.replace('{userId}', userId), request);
  }

  updateUserProject(userId: string, projectId: string, request: UpdateUserProjectRequest): Observable<UserProject> {
    return this.httpClient.put<UserProject>(this.userProjectUrlPattern.replace('{userId}', userId).replace('{projectId}', projectId),
      request);
  }

  deleteUserProject(userId: string, projectId: string): Observable<void> {
    return this.httpClient.delete<void>(this.userProjectUrlPattern.replace('{userId}', userId).replace('{projectId}', projectId));
  }

}
