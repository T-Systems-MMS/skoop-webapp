import { CommunityUserRegistrationResponse } from '../../shared/community-user-registration-response';
import { AbstractNotification } from '../abstract-notification';

export interface TodoNotification extends AbstractNotification{
  registration: CommunityUserRegistrationResponse;
  communityName: string;
}
