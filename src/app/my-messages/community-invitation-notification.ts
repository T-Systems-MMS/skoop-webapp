import { AbstractNotification } from './abstract-notification';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';

export class CommunityInvitationNotification extends AbstractNotification {
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

  getTypeText(): string {
    return 'Invitation to a community';
  }
}
