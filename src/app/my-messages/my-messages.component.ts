import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRegistration } from '../shared/community-user-registration';
import { MessagesService } from './messages.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { AbstractNotification } from './abstract-notification';
import { CommunityInvitationNotification } from './community-invitation-notification';
import { JoinCommunityRequestNotification } from './join-community-request-notification';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { Util } from '../util/util';
import { UserIdentityService } from '../shared/user-identity.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  errorMessage: string = null;
  currentUserId: string;
  notifications$ = of([]);

  constructor(private communityRegistrationService: CommunityRegistrationService,
              private messageService: MessagesService,
              private userIdentityService: UserIdentityService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.loadMessages();
  }

  hasJoinRequestType<T extends AbstractNotification>(notification: T): boolean {
    return notification.hasCommunityInvitationType() || notification.hasJoinCommunityType();
  }

  showAcceptDeclineButtons<T extends AbstractNotification>(notification: T) {
    if (notification.hasCommunityInvitationType()) {
      const invitationNotification: CommunityInvitationNotification = Util.createNotificationInstance(notification);
      return invitationNotification.registration.user.id === this.currentUserId &&
        (invitationNotification.registration.approvedByUser === null || invitationNotification.registration.approvedByCommunity === null);
    } else if (notification.hasJoinCommunityType()) {
      const joinRequestNotification: JoinCommunityRequestNotification = Util.createNotificationInstance(notification);
      return joinRequestNotification.registration.user.id !== this.currentUserId &&
        (joinRequestNotification.registration.approvedByUser === null || joinRequestNotification.registration.approvedByCommunity === null);
    } else {
      return false;
    }
  }

  onAccept<T extends AbstractNotification>(notification: T) {
    this.buildAcceptanceRequest(notification, true);
  }

  onDecline<T extends AbstractNotification>(notification: T) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to decline the request?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buildAcceptanceRequest(notification, false);
      }
    });
  }

  showDeleteButton<T extends AbstractNotification>(notification: T): boolean {
    return !notification.isToDoType();
  }

  delete<T extends AbstractNotification>(notification: T) {
    if (notification.isToDoType()) {
      throw new Error('Invalid type of notification to delete');
    }

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to delete the notification?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.delete(notification.id)
          .subscribe(() => {
            this.loadMessages();
            // update message counter
          }, errorResponse => {
            this.handleErrorResponse(errorResponse);
          });
      }
    });
  }

  private buildAcceptanceRequest<T extends AbstractNotification>(notification: T, isAccepted: boolean) {
    if (notification.hasCommunityInvitationType()) {
      const invitationNotification: CommunityInvitationNotification = Util.createNotificationInstance(notification);
      const requestData = {
        id: invitationNotification.registration.id,
        approvedByUser: isAccepted,
        approvedByCommunity: null
      };

      this.updateRegistration(invitationNotification.registration.community.id, requestData);
    } else if (notification.hasJoinCommunityType()) {
      const joinRequestNotification: JoinCommunityRequestNotification = Util.createNotificationInstance(notification);
      const requestData = {
        id: joinRequestNotification.registration.id,
        approvedByUser: null,
        approvedByCommunity: isAccepted
      };

      this.updateRegistration(joinRequestNotification.registration.community.id, requestData);
    }
  }

  private updateRegistration(communityId: string, registration: CommunityUserRegistration) {
    this.communityRegistrationService.updateRegistration(communityId, registration)
      .subscribe(() => {
        this.notifications$ = this.messageService.getUserNotifications(this.currentUserId);
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private loadMessages() {
    this.notifications$ = this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => {
        this.currentUserId = userIdentity.userId;
        return this.messageService.getUserNotifications(this.currentUserId);
      }));
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
