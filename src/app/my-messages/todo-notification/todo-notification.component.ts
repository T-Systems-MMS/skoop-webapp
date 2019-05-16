import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunityUserRegistration } from '../../shared/community-user-registration';
import { NotificationType } from '../notification-type.enum';
import { TodoNotification } from './todo-notification';

@Component({
  selector: 'app-todo-notification',
  template: ''
})
export class TodoNotificationComponent implements OnInit {

  @Input() notification: TodoNotification;
  @Input() currentUserId: string;
  @Output() processed: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();

  constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
  }

  ngOnInit() {
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

  getCommunityInfo(): string {
    return this.notification.registration.community ? `<a href="/communities/${this.notification.registration.community.id}">${this.notification.registration.community.title}</a>`
      : `<strong>${this.notification.communityName}</strong>`;
  }

  showAcceptDeclineButtons(notification: TodoNotification) {
    if (notification.type === NotificationType.INVITATION_TO_JOIN_COMMUNITY) {
      return notification.registration.user.id === this.currentUserId &&
        (notification.registration.approvedByUser === null || notification.registration.approvedByCommunity === null);
    } else if (notification.type === NotificationType.REQUEST_TO_JOIN_COMMUNITY) {
      return notification.registration.user.id !== this.currentUserId &&
        (notification.registration.approvedByUser === null || notification.registration.approvedByCommunity === null);
    } else {
      return false;
    }
  }

  onAccept(notification: TodoNotification) {
    this.buildAcceptanceRequest(notification, true);
  }

  onDecline(notification: TodoNotification) {
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
