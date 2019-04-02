import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from '../communities/communities.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { map } from 'rxjs/operators';
import { CommunityResponse } from '../communities/community-response';
import { UserIdentityService } from '../shared/user-identity.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { User } from '../users/user';
import { CommunityType } from '../communities/community-type.enum';
import { InfoDialogComponent } from '../shared/info-dialog/info-dialog.component';
import { CommunityUserResponse } from '../communities/community-user-response';
import { CommunityRole } from '../communities/community-role.enum';
import { CommunityInvitationDialogComponent } from './community-invitation-dialog.component';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRoleRequest } from './community-user-role-request';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {

  private currentUserId: string;

  community: CommunityResponse;
  communityMembers: CommunityUserResponse[] = [];
  communityManagers: CommunityUserResponse[] = [];
  errorMessage: string = null;
  isCommunityMember: boolean;
  isCommunityManager: boolean;

  constructor(private communityService: CommunitiesService,
              private userIdentityService: UserIdentityService,
              private registrationService: CommunityRegistrationService,
              private activatedRoute: ActivatedRoute,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('communityId')))
      .subscribe(communityId => {
        this.loadCommunity(communityId);
        this.loadCommunityUsers(communityId);
      });

    this.userIdentityService.getUserIdentity()
      .subscribe(userIdentity => {
        this.currentUserId = userIdentity.userId;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  joinCommunity() {
    if (this.community.type === CommunityType.OPEN) {
      this.joinOpenCommunity();
    } else {
      this.joinClosedCommunity();
    }
  }

  leaveCommunity() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to leave the community?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.communityService.leaveCommunity(this.community.id).subscribe(() => {
          this.isCommunityMember = false;
        }, (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        });
      }
    });
  }

  /**
   * User can leave a community when he/she is a member of a community and is not a community manager.
   */
  canLeaveCommunity() {
    return !this.isCommunityManager && this.isCommunityMember;
  }

  canRemoveMember(user: User) {
    return this.isCommunityManager && this.currentUserId !== user.id;
  }

  canInviteUsers() {
    if (!this.community) {
      return false;
    }

    return (this.community.type === CommunityType.OPEN && this.isCommunityMember)
      || (this.community.type === CommunityType.CLOSED && this.isCommunityManager);
  }

  removeMember(member: User) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: `Are you sure you want to kick out ${member.firstName} ${member.lastName}?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.communityService.removeMember(this.community.id, member.id).subscribe(() => {
          this.communityMembers = this.communityMembers.filter(cm => cm.user.id !== member.id);
        }, (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        });
      }
    });
  }

  canChangeRole(user: User): boolean {
    return this.isCommunityManager && user.id !== this.currentUserId;
  }

  changeRole(user: User, isRaising: boolean) {
    const updateRoleRequest: CommunityUserRoleRequest = {
      role: isRaising ? CommunityRole.MANAGER : CommunityRole.MEMBER
    };

    this.communityService.changeUserRole(this.community.id, user.id, updateRoleRequest)
      .subscribe(updatedUser => {
        if (isRaising) {
          this.communityMembers = this.communityMembers.filter(item => item.user.id !== updatedUser.user.id);
          this.communityManagers.push(updatedUser);
        } else {
          this.communityManagers = this.communityManagers.filter(item => item.user.id !== updatedUser.user.id);
          this.communityMembers.push(updatedUser);
        }

      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      })
  }

  openInvitationDialog() {
    this.dialog.open(CommunityInvitationDialogComponent, {
      width: '350px',
      data: {
        communityId: this.community.id
      }
    }).afterClosed().subscribe((users: User[]) => {
      this.showUsersInfoDialog(users);
    });
  }

  private loadCommunity(communityId: string) {
    this.communityService.getCommunity(communityId)
      .subscribe(community => {
        this.community = community;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private loadCommunityUsers(communityId: string) {
    this.communityService.getCommunityUsers(communityId, null).subscribe((communityUsers: CommunityUserResponse[]) => {
      this.detectMembership(communityUsers);
    }, (errorResponse: HttpErrorResponse) => {
      if (errorResponse.status !== 403) {
        this.handleErrorResponse(errorResponse);
      } else {
        this.isCommunityMember = false;
        this.isCommunityManager = false;
      }
    });
  }

  private detectMembership(communityUsers: CommunityUserResponse[]) {
    if (!communityUsers) {
      return;
    }
    this.userIdentityService.getUserIdentity().subscribe(userIdentity => {
      this.currentUserId = userIdentity.userId;
      this.communityMembers = communityUsers.filter(cm => cm.role === CommunityRole.MEMBER);
      this.communityManagers = communityUsers.filter(cm => cm.role === CommunityRole.MANAGER);
      this.isCommunityMember = this.communityMembers && this.communityMembers.some(item => item.user.id === userIdentity.userId);
      this.isCommunityManager = this.communityManagers && this.communityManagers.some(item => item.user.id === userIdentity.userId);
    }, errorResponse => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  private joinOpenCommunity() {
    this.communityService.joinCommunity(this.community.id)
      .subscribe(() => {
        this.isCommunityMember = true;
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private joinClosedCommunity() {
    this.registrationService.inviteUsers(this.community.id, [this.currentUserId])
      .subscribe(() => {
        this.showCommunityInfoDialog(this.community);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private showCommunityInfoDialog(community: CommunityResponse) {
    this.dialog.open(InfoDialogComponent, {
      width: '350px',
      data: {
        message: `The join request has been successfully sent to the community "${community.title}".`
      }
    });
  }

  private showUsersInfoDialog(users: User[]) {
    // click on cancel
    if (!users || users.length === 0) {
      return;
    }

    const userNames = users.map(user => `${user.firstName} ${user.lastName}`).join(', ');
    this.dialog.open(InfoDialogComponent, {
      width: '350px',
      data: {
        message: `Users ${userNames} were successfully invited to join the community.`
      }
    });
  }
}
