import { User } from '../users/user';

export interface SkillUser {
  user: User;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
}
