import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { UserProject } from '../user-projects/user-project';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';
import { NotificationCounterService } from '../shared/notification-counter.service';
import { ProjectMembershipService } from './project-membership.service';
import { ApproveUserProjectRequest } from './approve-user-project-request';

@Component({
  selector: 'app-project-memberships',
  templateUrl: './project-memberships.component.html',
  styleUrls: ['./project-memberships.component.scss']
})
export class ProjectMembershipsComponent implements OnInit {

  errorMessage: string;
  user: User = null;
  userProjects: UserProject[] = [];

  constructor(private userProjectService: UserProjectsService,
              private usersService: UsersService,
              private notificationCounterService: NotificationCounterService,
              private projectMembershipsService: ProjectMembershipService,
              public activatedRoute: ActivatedRoute,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('userId')))
      .subscribe(userId => {
        this.loadSubordinateProjects(userId);
        this.loadSubordinate(userId);
      });
  }

  onApprove(userProject: UserProject) {
    const request: UpdateUserProjectRequest = {
      role: userProject.role,
      skills: userProject.skills.map(item => item.name),
      tasks: userProject.tasks,
      startDate: userProject.startDate,
      endDate: userProject.endDate,
      approved: true
    };

    this.userProjectService.updateUserProject(this.user.id, userProject.project.id, request)
      .subscribe(() => {
        this.loadSubordinateProjects(this.user.id);
        this.notificationCounterService.loadCount();
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  showApproveAll(): boolean {
    return this.userProjects.length > 0 && this.userProjects.some(item => !item.approved);
  }

  approveAll() {
    const projectsToApprove: ApproveUserProjectRequest[] = this.userProjects
      .filter(userProject => !userProject.approved)
      .map(unapprovedUserProject => this.buildRequest(unapprovedUserProject));
    this.projectMembershipsService.approveAll(this.user.id, projectsToApprove).subscribe(() => {
      this.loadSubordinateProjects(this.user.id);
      this.notificationCounterService.loadCount();
    }, errorResponse => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private loadSubordinate(userId: string) {
    this.usersService.getUserById(userId).subscribe(user => {
      this.user = user;
    }, errorResponse => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private loadSubordinateProjects(userId: string) {
    this.userProjectService.getUserProjects(userId)
      .subscribe(projects => {
        this.userProjects = projects;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
    });
  }

  private buildRequest(userProject: UserProject): ApproveUserProjectRequest {
    return {
      projectId: userProject.project.id,
      role: userProject.role,
      skills: userProject.skills.map(item => item.name),
      tasks: userProject.tasks,
      startDate: userProject.startDate,
      endDate: userProject.endDate,
      approved: true
    };
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }
}
