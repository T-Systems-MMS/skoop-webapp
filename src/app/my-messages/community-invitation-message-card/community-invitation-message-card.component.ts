import { Component, OnInit } from '@angular/core';
import { TodoNotificationComponentTrait } from '../todo-notification-component-trait';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-community-invitation-message-card',
  templateUrl: './community-invitation-message-card.component.html',
  styleUrls: ['./community-invitation-message-card.component.scss']
})
export class CommunityInvitationMessageCardComponent extends TodoNotificationComponentTrait implements OnInit {

  constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
    super(communityRegistrationService, dialog);
  }

  ngOnInit() {
  }

}
