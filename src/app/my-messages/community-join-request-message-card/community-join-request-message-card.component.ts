import { Component, OnInit } from '@angular/core';
import { TodoNotificationComponentTrait } from '../todo-notification-component-trait';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-community-join-request-message-card',
  templateUrl: './community-join-request-message-card.component.html',
  styleUrls: ['./community-join-request-message-card.component.scss']
})
export class CommunityJoinRequestMessageCardComponent extends TodoNotificationComponentTrait implements OnInit {

  constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
    super(communityRegistrationService, dialog);
  }

  ngOnInit(): void {
  }

}
