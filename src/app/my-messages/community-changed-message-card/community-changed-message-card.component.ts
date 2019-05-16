import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponent } from '../deletable-notification/deletable-notification.component';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { CommunityChangedNotification } from '../community-changed-notification';
import { CommunityDetails } from '../community-details.enum';

@Component({
  selector: 'app-community-changed-message-card',
  templateUrl: './community-changed-message-card.component.html',
  styleUrls: ['./community-changed-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityChangedMessageCardComponent extends DeletableNotificationComponent implements OnInit {

  @Input() notification: CommunityChangedNotification;

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

  public getChanges(): string {
    return this.notification.communityDetails.map(item => CommunityDetails[item]).join(', ');
  }

}
