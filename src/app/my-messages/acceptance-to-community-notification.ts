import { AbstractNotification } from './abstract-notification';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class AcceptanceToCommunityNotification extends AbstractCommunityNotification {
  registration: CommunityUserRegistrationResponse;
  communityName: string;

  getTypeText(): string {
    return 'Acceptance to a community';
  }

  isToDoType(): boolean {
    return false;
  }

  getHtmlMessageText(): string {
    return '';
  }
}
