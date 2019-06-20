import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material/dialog';
import { CommunityDeletedNotification } from './community-deleted-notification';

@Component({
  selector: 'app-community-deleted-message-card',
  templateUrl: './community-deleted-message-card.component.html',
  styleUrls: ['./community-deleted-message-card.component.scss']
})
export class CommunityDeletedMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: CommunityDeletedNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

}
