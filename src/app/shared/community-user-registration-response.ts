import { User } from '../users/user';
import { CommunityUserRegistration } from './community-user-registration';
import { Community } from '../communities/community';

export interface CommunityUserRegistrationResponse extends CommunityUserRegistration {
  user: User;
  community?: Community;
}
