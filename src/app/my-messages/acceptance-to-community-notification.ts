import { AbstractNotification } from './abstract-notification';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';

export class AcceptanceToCommunityNotification extends AbstractNotification {
  registration: CommunityUserRegistrationResponse;

  getTypeText(): string {
    return 'Acceptance to a community';
  }
}
