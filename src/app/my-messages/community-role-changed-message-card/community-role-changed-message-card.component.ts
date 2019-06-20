import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material/dialog';
import { CommunityRoleChangedNotification } from './community-role-changed-notification';

@Component({
  selector: 'app-community-role-changed-message-card',
  templateUrl: './community-role-changed-message-card.component.html',
  styleUrls: ['./community-role-changed-message-card.component.scss']
})
export class CommunityRoleChangedMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: CommunityRoleChangedNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

}
