import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrlPattern = `${environment.serverApiUrl}/projects`;
  private projectUrlPattern = `${environment.serverApiUrl}/projects/{projectId}`;

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.projectsUrlPattern);
  }

  createProject(data: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.projectsUrlPattern, data);
  }

  updateProject(data: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.projectUrlPattern.replace('{projectId}', data.id), data);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.httpClient.delete<void>(this.projectUrlPattern.replace('{projectId}', projectId));
  }

}
