import { Injectable } from '@angular/core';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserProject } from '../user-projects/user-project';
import { AssignUserProjectRequest } from '../user-projects/assign-user-project-request';
import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';

@Injectable({
  providedIn: 'root'
})
export class MyProjectsService {

  constructor(private userIdentityService: UserIdentityService,
              private userProjectService: UserProjectsService) {}

  getCurrentUserProjects(): Observable<UserProject[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userProjectService.getUserProjects(userIdentity.userId)));
  }

  assignProjectToCurrentUser(request: AssignUserProjectRequest): Observable<UserProject>  {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userProjectService.assignProjectToUser(userIdentity.userId, request)));
  }

  updateCurrentUserProject(projectId: string, request: UpdateUserProjectRequest): Observable<UserProject> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userProjectService.updateUserProject(userIdentity.userId, projectId, request)));
  }

  deleteCurrentUserProject(projectId: string): Observable<void> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => this.userProjectService.deleteUserProject(userIdentity.userId, projectId)));
  }

}
