import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRegistration } from '../shared/community-user-registration';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  messages$: Observable<CommunityUserRegistrationResponse[]> = of([]);

  constructor(private communityRegistrationService: CommunityRegistrationService) {
  }

  ngOnInit() {
   this.messages$ = this.communityRegistrationService.getUserRegistrations();
  }

  showButtons(message: CommunityUserRegistrationResponse) {
    // return (message.type === MessageType.COMMUNITY_JOIN_REQUEST || message.type === MessageType.INVITATION)
    //   && message.status === MessageStatus.PENDING && message.recipient.id === this.currentUserId;
    return true;
  }

  onAccept(message: CommunityUserRegistrationResponse) {
    const requestData: CommunityUserRegistration = {
      id: message.id,
      approvedByUser: true,
      approvedByCommunity: message.approvedByCommunity
    };
    this.communityRegistrationService.updateRegistration(message.community.id, requestData)
      .subscribe(()=>{

      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  onDecline(message: CommunityUserRegistrationResponse) {

  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    // this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // // Dirty fix because of: https://github.com/angular/angular/issues/17772
    // this.changeDetector.markForCheck();
  }

}
