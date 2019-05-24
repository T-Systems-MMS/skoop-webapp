import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { Observable, of } from 'rxjs';
import { UserProject } from '../user-projects/user-project';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-project-memberships',
  templateUrl: './project-memberships.component.html',
  styleUrls: ['./project-memberships.component.scss']
})
export class ProjectMembershipsComponent implements OnInit {

  errorMessage: string;
  userId: string;
  user$: Observable<User> = of();
  userProjects$: Observable<UserProject[]> = of([]);

  constructor(private userProjectService: UserProjectsService,
              private usersService: UsersService,
              public activatedRoute: ActivatedRoute,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('userId')))
      .subscribe(userId => {
        this.userProjects$ = this.userProjectService.getUserProjects(userId)
          .pipe(
            catchError((err: HttpErrorResponse, caught: Observable<UserProject[]>) => {
              this.errorMessage = this.globalErrorHandlerService.createFullMessage(err);
              return of([]);
            })
          );
        this.user$ = this.usersService.getUserById(userId);
      });
  }

}
