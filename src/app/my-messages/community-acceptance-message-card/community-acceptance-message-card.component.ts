import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponent } from '../deletable-notification/deletable-notification.component';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { AcceptanceToCommunityNotification } from './acceptance-to-community-notification';

@Component({
  selector: 'app-community-acceptance-message-card',
  templateUrl: './community-acceptance-message-card.component.html',
  styleUrls: ['./community-acceptance-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityAcceptanceMessageCardComponent extends DeletableNotificationComponent implements OnInit {

  @Input() notification: AcceptanceToCommunityNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  getCommunityInfo(): string {
    return this.notification.registration.community ? `<a href="/communities/${this.notification.registration.community.id}">${this.notification.registration.community.title}</a>`
      : `<strong>${this.notification.communityName}</strong>`;
  }

}
