import { Component, OnInit } from '@angular/core';
import { TodoNotificationComponent } from '../todo-notification/todo-notification.component';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-community-join-request-message-card',
  templateUrl: './community-join-request-message-card.component.html',
  styleUrls: ['./community-join-request-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityJoinRequestMessageCardComponent extends TodoNotificationComponent implements OnInit {

  constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
    super(communityRegistrationService, dialog);
  }

}
