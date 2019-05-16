import { Component, Input, OnInit } from '@angular/core';
import { TodoNotificationComponent } from '../todo-notification/todo-notification.component';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { MatDialog } from '@angular/material';
import { JoinCommunityRequestNotification } from './join-community-request-notification';

@Component({
  selector: 'app-community-join-request-message-card',
  templateUrl: './community-join-request-message-card.component.html',
  styleUrls: ['./community-join-request-message-card.component.scss', '../my-messages.component.scss']
})
export class CommunityJoinRequestMessageCardComponent extends TodoNotificationComponent implements OnInit {

  @Input() notification: JoinCommunityRequestNotification;

  constructor(protected communityRegistrationService: CommunityRegistrationService,
              protected dialog: MatDialog) {
    super(communityRegistrationService, dialog);
  }

  ngOnInit() {
  }

  getStatusText(): string {
    if (this.notification.registration.approvedByUser && this.notification.registration.approvedByCommunity) {
      return 'Accepted';
    }

    if (this.notification.registration.approvedByCommunity === false || this.notification.registration.approvedByUser === false) {
      return 'Declined';
    }

    return 'Pending';
  }

  getCommunityInfo(): string {
    return this.notification.registration.community ? `<a href="/communities/${this.notification.registration.community.id}">${this.notification.registration.community.title}</a>`
      : `<strong>${this.notification.communityName}</strong>`;
  }

}
