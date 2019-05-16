import { CommunityUserRegistrationResponse } from '../../shared/community-user-registration-response';
import { AbstractNotification } from '../abstract-notification';

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

  getHtmlMessageText(): string {
    return 'Invitation to a community';
  }

  getCommunityInfo(): string {
    return this.registration.community ? `<a href="/communities/${this.registration.community.id}">${this.registration.community.title}</a>`
      : this.communityName;
  }
}
