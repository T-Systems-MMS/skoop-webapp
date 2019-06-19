import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptanceToCommunityNotification } from './acceptance-to-community-notification';

@Component({
  selector: 'app-community-acceptance-message-card',
  templateUrl: './community-acceptance-message-card.component.html',
  styleUrls: ['./community-acceptance-message-card.component.scss']
})
export class CommunityAcceptanceMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: AcceptanceToCommunityNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

}
