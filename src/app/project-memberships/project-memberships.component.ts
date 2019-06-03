import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { Observable, of } from 'rxjs';
import { UserProject } from '../user-projects/user-project';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';
import { NotificationCounterService } from '../shared/notification-counter.service';

@Component({
  selector: 'app-project-memberships',
  templateUrl: './project-memberships.component.html',
  styleUrls: ['./project-memberships.component.scss']
})
export class ProjectMembershipsComponent implements OnInit {

  errorMessage: string;
  user: User = null;
  userProjects$: Observable<UserProject[]> = of([]);

  constructor(private userProjectService: UserProjectsService,
              private usersService: UsersService,
              private notificationCounterService: NotificationCounterService,
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
      .subscribe(()=> {
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
    this.userProjects$ = this.userProjectService.getUserProjects(userId)
      .pipe(
        catchError((err: HttpErrorResponse, caught: Observable<UserProject[]>) => {
          this.handleErrorResponse(err);
          return of([]);
        })
      );
  }

  public handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }


}
