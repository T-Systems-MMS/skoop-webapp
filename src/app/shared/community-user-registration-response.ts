import { MessageStatus } from '../my-messages/message-status.enum';
import { User } from '../users/user';
import { Community } from '../communities/community';
import { CommunityUserRegistration } from './community-user-registration';

export interface CommunityUserRegistrationResponse extends CommunityUserRegistration {
  user: User;
  community: Community;
  creationDatetime: Date;
  status: MessageStatus;
}
