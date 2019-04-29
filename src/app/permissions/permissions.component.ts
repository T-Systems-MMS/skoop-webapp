import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { User } from '../users/user';
import { finalize } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { UserPermissionScope } from '../users/user-permission-scope';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  errorMessage: string = null;
  authorizedSkillsUsers: User[];
  authorizedProfileUsers: User[];

  @Input() savingInProgress: boolean;

  constructor(private usersService: UsersService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {

  }

  ngOnInit() {
    this.loadAuthorizedUsers(UserPermissionScope.READ_USER_SKILLS, users => this.authorizedSkillsUsers = users);
    this.loadAuthorizedUsers(UserPermissionScope.READ_USER_PROFILE, users => this.authorizedProfileUsers = users);
  }

  savePermissions() {
    this.savingInProgress = true;
    this.usersService.updateAuthorizedUsers(UserPermissionScope.READ_USER_SKILLS, this.authorizedSkillsUsers)
      .pipe(
        finalize( () => {
            this.savingInProgress = false;
          }
        )
      )
      .subscribe(authorizedUsers => {
        this.authorizedSkillsUsers = authorizedUsers;
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private loadAuthorizedUsers(scope: UserPermissionScope, callback: (users:User[]) => void): void {
    this.usersService.getAuthorizedUsers(scope)
      .subscribe(authorizedUsers => {
        callback(authorizedUsers);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
