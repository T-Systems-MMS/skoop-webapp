import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { MemberLeftCommunityNotification } from './member-left-community-notification';

@Component({
  selector: 'app-community-left-message-card',
  templateUrl: './community-left-message-card.component.html',
  styleUrls: ['./community-left-message-card.component.scss']
})
export class CommunityLeftMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: MemberLeftCommunityNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  getCommunityInfo(): string {
    return this.notification.community ? `<a href="/communities/${this.notification.community.id}">${this.notification.community.title}</a>`
      : `<strong>this.notification.communityName</strong>`;
  }

}
