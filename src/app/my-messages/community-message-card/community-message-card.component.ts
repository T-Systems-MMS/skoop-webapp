import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractCommunityNotification } from '../abstract-community-notification';
import { AbstractNotification } from '../abstract-notification';
import { CommunityInvitationNotification } from '../community-invitation-notification';
import { Util } from '../../util/util';
import { JoinCommunityRequestNotification } from '../join-community-request-notification';
import { CommunityUserRegistration } from '../../shared/community-user-registration';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { NotificationCounterService } from '../../shared/notification-counter.service';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-community-message-card',
  templateUrl: './community-message-card.component.html',
  styleUrls: ['./community-message-card.component.scss']
})
export class CommunityMessageCardComponent implements OnInit {

  @Input() notification: AbstractCommunityNotification;
  @Input() currentUserId: string;
  @Output() onSuccess: EventEmitter<void> = new EventEmitter();
  @Output() onErrorResponse: EventEmitter<HttpErrorResponse> = new EventEmitter();

  constructor(public dialog: MatDialog,
              private notificationCounterService: NotificationCounterService,
              private communityRegistrationService: CommunityRegistrationService) {
  }

  ngOnInit() {
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
        this.onSuccess.emit();
        this.notificationCounterService.decrementCount();
      }, errorResponse => {
        this.onErrorResponse.emit(errorResponse);
      });
  }

}
