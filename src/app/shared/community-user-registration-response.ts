import { User } from '../users/user';

export interface CommunityUserRegistrationResponse {
  user: User;
  approvedByUser: boolean;
  approvedByCommunity: boolean;
}
