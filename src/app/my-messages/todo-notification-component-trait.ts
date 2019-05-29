import { EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunityUserRegistration } from '../shared/community-user-registration';
import { NotificationType } from './notification-type.enum';
import { TodoNotification } from './todo-notification';

export abstract class TodoNotificationComponentTrait {

  @Input() notification: TodoNotification;
  @Input() currentUserId: string;
  @Output() processed: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();

  protected constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
  }

  getStatusText(): string {
    if (this.notification.registration.approvedByUser && this.notification.registration.approvedByCommunity) {
      return 'Accepted';
    }

    if (this.notification.registration.approvedByCommunity === false || this.notification.registration.approvedByUser === false) {
      return 'Declined';
    }

    return 'Pending';
  }

  showAcceptDeclineButtons() {
    if (this.notification.type === NotificationType.INVITATION_TO_JOIN_COMMUNITY) {
      return this.notification.registration.user.id === this.currentUserId &&
        (this.notification.registration.approvedByUser === null || this.notification.registration.approvedByCommunity === null);
    } else if (this.notification.type === NotificationType.REQUEST_TO_JOIN_COMMUNITY) {
      return this.notification.registration.user.id !== this.currentUserId &&
        (this.notification.registration.approvedByUser === null || this.notification.registration.approvedByCommunity === null);
    } else {
      return false;
    }
  }

  onAccept() {
    this.buildAcceptanceRequest(this.notification, true);
  }

  onDecline() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to decline the request?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buildAcceptanceRequest(this.notification, false);
      }
    });
  }

  private buildAcceptanceRequest(notification: TodoNotification, isAccepted: boolean) {
    if (notification.type === NotificationType.INVITATION_TO_JOIN_COMMUNITY) {
      const requestData = {
        id: notification.registration.id,
        approvedByUser: isAccepted,
        approvedByCommunity: null
      };

      this.updateRegistration(notification.registration.community.id, requestData);
    } else if (notification.type === NotificationType.REQUEST_TO_JOIN_COMMUNITY) {
      const requestData = {
        id: notification.registration.id,
        approvedByUser: null,
        approvedByCommunity: isAccepted
      };

      this.updateRegistration(notification.registration.community.id, requestData);
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
