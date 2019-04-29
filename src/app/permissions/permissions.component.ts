import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { User } from '../users/user';
import { finalize } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { UserPermissionScope } from '../users/user-permission-scope';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserPermissionRequest } from './user-permission-request';
import { UserPermission } from '../users/user-permission';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  errorMessage: string = null;
  authorizedSkillsUsers: User[] = [];
  authorizedProfileUsers: User[] = [];

  allowAll = new FormControl();

  @Input() savingInProgress: boolean;

  constructor(private usersService: UsersService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {

  }

  ngOnInit() {
    this.loadAuthorizedUsers();
  }

  savePermissions() {
    this.savingInProgress = true;
    const userSkillPermission: UserPermissionRequest = {
      scope: UserPermissionScope.READ_USER_SKILLS,
      authorizedUserIds: this.authorizedSkillsUsers.map(item => item.id)
    };
    const userProfilePermission: UserPermissionRequest = {
      scope: UserPermissionScope.READ_USER_PROFILE
    };

    if (this.allowAll.value === true) {
      userProfilePermission.allUsersAuthorized = true;
    } else {
      userProfilePermission.authorizedUserIds = this.authorizedProfileUsers.map(item => item.id);
    }

    this.usersService.updatePermissions([userSkillPermission, userProfilePermission])
      .pipe(
        finalize( () => {
            this.savingInProgress = false;
          }
        )
      )
      .subscribe(userPermissions => {
        this.detectUserPermissions(userPermissions);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private loadAuthorizedUsers(): void {
    this.usersService.getPermissions()
      .subscribe(userPermissions => {
        this.detectUserPermissions(userPermissions);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private detectUserPermissions(userPermissions: UserPermission[]) {
    let permission = userPermissions.find(userPermission => userPermission.scope === UserPermissionScope.READ_USER_PROFILE);
    this.authorizedProfileUsers =  permission ? permission.authorizedUsers : [];

    permission = userPermissions.find(userPermission => userPermission.scope === UserPermissionScope.READ_USER_SKILLS);
    this.authorizedSkillsUsers =  permission ? permission.authorizedUsers : [];
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
