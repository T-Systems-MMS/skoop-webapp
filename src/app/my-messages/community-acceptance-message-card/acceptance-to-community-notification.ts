import { CommunityUserRegistrationResponse } from '../../shared/community-user-registration-response';
import { AbstractNotification } from '../abstract-notification';

export interface AcceptanceToCommunityNotification extends AbstractNotification {
  registration: CommunityUserRegistrationResponse;
  communityName: string;
}
