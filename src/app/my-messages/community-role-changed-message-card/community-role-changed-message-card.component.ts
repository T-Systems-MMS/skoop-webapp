import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponent } from '../deletable-notification/deletable-notification.component';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { CommunityRoleChangedNotification } from '../community-role-changed-notification';

@Component({
  selector: 'app-community-role-changed-message-card',
  templateUrl: './community-role-changed-message-card.component.html',
  styleUrls: ['./community-role-changed-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityRoleChangedMessageCardComponent extends DeletableNotificationComponent implements OnInit {

  @Input() notification: CommunityRoleChangedNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

}
