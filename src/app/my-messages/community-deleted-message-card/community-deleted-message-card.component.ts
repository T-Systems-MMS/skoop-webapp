import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponent } from '../deletable-notification/deletable-notification.component';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { CommunityDeletedNotification } from '../community-deleted-notification';

@Component({
  selector: 'app-community-deleted-message-card',
  templateUrl: './community-deleted-message-card.component.html',
  styleUrls: ['./community-deleted-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityDeletedMessageCardComponent extends DeletableNotificationComponent implements OnInit {

  @Input() notification: CommunityDeletedNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

}
