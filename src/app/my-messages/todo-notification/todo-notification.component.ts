import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractNotification } from '../abstract-notification';
import { CommunityInvitationNotification } from '../community-invitation-message-card/community-invitation-notification';
import { Util } from '../../util/util';
import { JoinCommunityRequestNotification } from '../community-join-request-message-card/join-community-request-notification';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunityUserRegistration } from '../../shared/community-user-registration';

@Component({
  selector: 'app-todo-notification',
  template: ''
})
export class TodoNotificationComponent implements OnInit {

  @Input() currentUserId: string;
  @Output() processed: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();

  constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
  }

  ngOnInit() {
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
        this.processed.emit();
      }, errorResponse => {
        this.error.emit(errorResponse);
      });
  }

}
