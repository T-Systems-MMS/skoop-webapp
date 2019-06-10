import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserPermissionScope } from '../users/user-permission-scope';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-other-user-profiles',
  templateUrl: './other-user-profiles.component.html',
  styleUrls: ['./other-user-profiles.component.scss']
})
export class OtherUserProfilesComponent implements OnInit {

  permissionOwners: User[] = [];
  errorMessage: string = null;

  constructor(private usersService: UsersService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.loadPermissionOwners();
  }

  private loadPermissionOwners(): void {
    combineLatest(
      this.usersService.getGlobalPermissionOwnersByScope(UserPermissionScope.READ_USER_SKILLS),
      this.usersService.getPersonalPermissionOwnersByScope(UserPermissionScope.READ_USER_SKILLS)
    )
      .subscribe(compoundObject => {
        this.permissionOwners = compoundObject[0]; // copy all global permissions owners

        // add personal permissions owners, which don't exist in global permissions owners
        compoundObject[1].forEach(ownerPersonalPermission => {
          if (!this.permissionOwners.find(owner => owner.id === ownerPersonalPermission.id)) {
            this.permissionOwners.push(ownerPersonalPermission);
          }
        });

      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

}
