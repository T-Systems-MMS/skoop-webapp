import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { UserIdentityService } from '../shared/user-identity.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { Message } from './message';
import { switchMap } from 'rxjs/operators';
import { MessageType } from './message-type.enum';
import { MessageStatus } from './message-status.enum';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  private currentUserId: string;

  displayedColumns: string[] = ['sender', 'date', 'community', 'status', 'type', 'operations'];
  dataSource = new MatTableDataSource<Message>();


  constructor(private messageService: MessageService,
              private userIdentityService: UserIdentityService) {
  }

  ngOnInit() {
   this.userIdentityService.getUserIdentity()
     .pipe(switchMap(userIdentity => {
       this.currentUserId = userIdentity.userId;
       return this.messageService.getMessages(userIdentity.userId);
     })).subscribe(messages => {
       this.dataSource.data = messages;
    }, errorResponse => {
       this.handleErrorResponse(errorResponse);
   });
  }

  showButtons(message: Message) {
    return (message.type === MessageType.COMMUNITY_JOIN_REQUEST || message.type === MessageType.INVITATION)
      && message.status === MessageStatus.PENDING && message.recipient.id === this.currentUserId;
  }

  onAccept(message: Message) {

  }

  onDecline(message: Message) {

  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    // this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // // Dirty fix because of: https://github.com/angular/angular/issues/17772
    // this.changeDetector.markForCheck();
  }

}
