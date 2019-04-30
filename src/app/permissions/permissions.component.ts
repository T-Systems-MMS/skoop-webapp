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
import { GlobalUserPermission } from './global-user-permission';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  errorMessage: string = null;
  authorizedSkillsUsers: User[] = [];
  authorizedProfileUsers: User[] = [];

  allowAllToViewProfile = new FormControl();
  allowAllToViewSkills = new FormControl();

  @Input() savingInProgress: boolean;
  private savingUsersPermissionInProgress = false;
  private savingGlobalPermissionInProgress = false;

  constructor(private usersService: UsersService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {

  }

  ngOnInit() {
    this.loadAuthorizedUsers();
    this.loadGlobalPermissions();
  }

  savePermissions() {
    this.savingInProgress = true;
    this.saveUsersPermissions();
    this.saveGlobalPermissions();
  }

  private saveUsersPermissions() {
    this.savingUsersPermissionInProgress = true;
    const userPermissionRequests: UserPermissionRequest[] = [
      {
        scope: UserPermissionScope.READ_USER_SKILLS,
        authorizedUserIds: this.authorizedSkillsUsers.map(item => item.id)
      },
      {
        scope: UserPermissionScope.READ_USER_PROFILE,
        authorizedUserIds: this.authorizedProfileUsers.map(item => item.id)
      }
    ];
    this.usersService.updatePermissions(userPermissionRequests)
      .pipe(
        finalize(() => {
            this.savingUsersPermissionInProgress = false;
            if (!this.savingGlobalPermissionInProgress && !this.savingUsersPermissionInProgress) {
              this.savingInProgress = false;
            }
          }
        )
      )
      .subscribe(userPermissions => {
        this.detectUserPermissions(userPermissions);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private saveGlobalPermissions() {
    this.savingGlobalPermissionInProgress = true;
    const globalPermissions: GlobalUserPermission[] = [];
    if (this.allowAllToViewSkills.value) {
      globalPermissions.push({scope: UserPermissionScope.READ_USER_SKILLS});
    }
    if (this.allowAllToViewProfile.value) {
      globalPermissions.push({scope: UserPermissionScope.READ_USER_PROFILE});
    }

    this.usersService.updateGlobalUserPermissions(globalPermissions)
      .pipe(
        finalize(() => {
            this.savingGlobalPermissionInProgress = false;
            if (!this.savingGlobalPermissionInProgress && !this.savingUsersPermissionInProgress) {
              this.savingInProgress = false;
            }
          }
        )
      )
      .subscribe(globalPermissions => {
        this.detectGlobalPermissions(globalPermissions);
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

  private loadGlobalPermissions() {
    this.usersService.getGlobalUserPermissions()
      .subscribe(globalPermissions => {
        this.detectGlobalPermissions(globalPermissions);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private detectUserPermissions(userPermissions: UserPermission[]) {
    let permission = userPermissions.find(userPermission => userPermission.scope === UserPermissionScope.READ_USER_PROFILE);
    this.authorizedProfileUsers = permission ? permission.authorizedUsers : [];

    permission = userPermissions.find(userPermission => userPermission.scope === UserPermissionScope.READ_USER_SKILLS);
    this.authorizedSkillsUsers = permission ? permission.authorizedUsers : [];
  }

  private detectGlobalPermissions(userPermissions: GlobalUserPermission[]) {
    let permission = userPermissions.find(globalPermission => globalPermission.scope === UserPermissionScope.READ_USER_SKILLS);
    this.allowAllToViewSkills.setValue(permission != null);

    permission = userPermissions.find(userPermission => userPermission.scope === UserPermissionScope.READ_USER_PROFILE);
    this.allowAllToViewProfile.setValue(permission != null);
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
