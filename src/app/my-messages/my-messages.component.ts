import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRegistration } from '../shared/community-user-registration';
import { Message } from './message';
import { MessagesService } from './messages.service';
import { MessageType } from './message-type.enum';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  messages$: Observable<Message[]> = of([]);

  constructor(private communityRegistrationService: CommunityRegistrationService,
              private messageService: MessagesService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
   this.messages$ = this.messageService.getUserRegistrations();
  }

  showInvitationButtons(message: Message) {
    return (message.type === MessageType.INVITATION_TO_JOIN_COMMUNITY || message.type === MessageType.REQUEST_TO_JOIN_COMMUNITY)
      && (message.registration.approvedByUser == null || message.registration.approvedByCommunity == null);
  }

  onAccept(message: Message) {
    const requestData: CommunityUserRegistration = {
      id: message.id,
      approvedByUser: true,
      approvedByCommunity: true
    };
    this.updateRegistration(message.community.id, requestData);
  }

  onDecline(message: Message) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to decline the request?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const requestData: CommunityUserRegistration = {
          id: message.id,
          approvedByUser: message.registration.approvedByUser || false,
          approvedByCommunity: message.registration.approvedByCommunity || false
        };
        this.updateRegistration(message.community.id, requestData);
      }
    });
  }

  private updateRegistration(communityId: string, registration: CommunityUserRegistration) {
    this.communityRegistrationService.updateRegistration(communityId, registration)
      .subscribe(()=>{

      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  getStatusText(message: Message) {
    if (!message.registration) {
      return '';
    }

    if (message.registration.approvedByUser && message.registration.approvedByCommunity) {
      return 'Accepted';
    }

    if (message.registration.approvedByCommunity === false || message.registration.approvedByUser === false) {
      return 'Declined';
    }

    return 'Pending';
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    // this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // // Dirty fix because of: https://github.com/angular/angular/issues/17772
    // this.changeDetector.markForCheck();
  }

}
