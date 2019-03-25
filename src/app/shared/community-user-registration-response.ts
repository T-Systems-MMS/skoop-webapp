import { User } from '../users/user';
import { CommunityUserRegistration } from './community-user-registration';

export interface CommunityUserRegistrationResponse extends CommunityUserRegistration {
  user: User;
}
