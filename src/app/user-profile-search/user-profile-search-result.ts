import { User } from '../users/user';
import { UserSkill } from '../user-skills/user-skill';

export interface UserProfileSearchResult extends User {
  manager: User;
  skills: UserSkill[];
}
