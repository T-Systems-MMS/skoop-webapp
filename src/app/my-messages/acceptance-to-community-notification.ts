import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class AcceptanceToCommunityNotification extends AbstractCommunityNotification {
  registration: CommunityUserRegistrationResponse;
  communityName: string;

  getTypeText(): string {
    return 'Acceptance to a community';
  }

  getHtmlMessageText(): string {
    return 'Your request to community was accepted';
  }

  getCommunityInfo(): string {
    return this.registration.community ? `<a href="/communities/${this.registration.community.id}">${this.registration.community.title}</a>`
      : this.communityName;
  }
}
