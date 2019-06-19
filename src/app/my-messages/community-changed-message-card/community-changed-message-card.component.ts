import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material/dialog';
import { CommunityChangedNotification } from './community-changed-notification';
import { CommunityDetails } from './community-details.enum';

@Component({
  selector: 'app-community-changed-message-card',
  templateUrl: './community-changed-message-card.component.html',
  styleUrls: ['./community-changed-message-card.component.scss']
})
export class CommunityChangedMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: CommunityChangedNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  public getChanges(): string {
    return this.notification.communityDetails.map(item => CommunityDetails[item]).join(', ');
  }

}
