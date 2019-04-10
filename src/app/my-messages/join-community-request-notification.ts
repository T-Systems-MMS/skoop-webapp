import { AbstractNotification } from './abstract-notification';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';

export class JoinCommunityRequestNotification extends AbstractNotification {
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

  isCompleted(): boolean {
    return (this.registration.approvedByUser && this.registration.approvedByCommunity)
      || (this.registration.approvedByCommunity === false || this.registration.approvedByUser === false);
  }

  isToDoType(): boolean {
    return true;
  }

  getTypeText(): string {
    return 'Request to join a community';
  }
}
