import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Project } from './project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private projectsUrlPattern = `${environment.serverApiUrl}/projects`;

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.projectsUrlPattern);
  }

  createProject(data: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.projectsUrlPattern,
      data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }

}
