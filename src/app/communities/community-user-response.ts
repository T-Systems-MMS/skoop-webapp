import { User } from '../users/user';
import { CommunityRole } from './community-role.enum';

export class CommunityUserResponse {
  user: User;
  role: CommunityRole;
}
