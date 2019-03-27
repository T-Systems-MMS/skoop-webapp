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

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  errorMessage: string = null;
  notifications$ = of([]);

  constructor(private communityRegistrationService: CommunityRegistrationService,
              private messageService: MessagesService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
   this.notifications$ = this.messageService.getUserNotifications();
  }

  hasJoinRequestType<T extends AbstractNotification>(notification: T): boolean {
    return notification.hasCommunityInvitationType() || notification.hasJoinCommunityType();
  }

  showAcceptDeclineButtons<T extends AbstractNotification>(notification: T) {
    if (notification.hasCommunityInvitationType()) {
      const registration = (<CommunityInvitationNotification><any>notification).registration;
      return registration.approvedByUser === null || registration.approvedByCommunity === null;
    } else if (notification.hasJoinCommunityType()) {
      const registration = (<JoinCommunityRequestNotification><any>notification).registration;
      return registration.approvedByUser === null || registration.approvedByCommunity === null;
    } else {
      return false;
    }
  }

  onAccept<T extends AbstractNotification>(notification: T) {
    const registration = notification.hasCommunityInvitationType() ?
      (<CommunityInvitationNotification><any>notification).registration :
      (<JoinCommunityRequestNotification><any>notification).registration;
    const requestData: CommunityUserRegistration = {
      id: registration.id,
      approvedByUser: true,
      approvedByCommunity: true
    };
    this.updateRegistration(registration.community.id, requestData);
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
        const registration = notification.hasCommunityInvitationType() ?
          (<CommunityInvitationNotification><any>notification).registration :
          (<JoinCommunityRequestNotification><any>notification).registration;

        const requestData: CommunityUserRegistration = {
          id: registration.id,
          approvedByUser: registration.approvedByUser || false,
          approvedByCommunity: registration.approvedByCommunity || false
        };
        this.updateRegistration(registration.community.id, requestData);
      }
    });
  }

  private updateRegistration(communityId: string, registration: CommunityUserRegistration) {
    this.communityRegistrationService.updateRegistration(communityId, registration)
      .subscribe(() => {
        this.notifications$ = this.messageService.getUserNotifications();
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
