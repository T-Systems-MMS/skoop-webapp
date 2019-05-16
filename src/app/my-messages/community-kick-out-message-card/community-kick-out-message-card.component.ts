import { Component, Input, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { MemberKickedOutNotification } from './member-kicked-out-notification';
import { DeletableNotificationComponent } from '../deletable-notification/deletable-notification.component';

@Component({
  selector: 'app-community-kick-out-message-card',
  templateUrl: './community-kick-out-message-card.component.html',
  styleUrls: ['./community-kick-out-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityKickOutMessageCardComponent extends DeletableNotificationComponent implements OnInit {

  @Input() notification: MemberKickedOutNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  public getCommunityInfo(): string {
    return this.notification.community ? `<a href="/communities/${this.notification.community.id}">${this.notification.community.title}</a>`
      : `<strong>${this.notification.communityName}</strong>`;
  }

}
