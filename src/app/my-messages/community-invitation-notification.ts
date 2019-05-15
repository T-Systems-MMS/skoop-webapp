import { AbstractNotification } from './abstract-notification';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class CommunityInvitationNotification extends AbstractCommunityNotification {
  registration: CommunityUserRegistrationResponse;
  communityName: string;

  getStatusText(): string {
    if (this.registration.approvedByUser && this.registration.approvedByCommunity) {
      return 'Accepted';
    }

    if (this.registration.approvedByCommunity === false || this.registration.approvedByUser === false) {
      return 'Declined';
    }

    return 'Pending';
  }

  isToDoType(): boolean {
    return true;
  }

  getTypeText(): string {
    return 'Invitation to a community';
  }

  getHtmlMessageText(): string {
    return '';
  }
}
