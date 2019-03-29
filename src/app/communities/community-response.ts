import { Skill } from '../skills/skill';
import { Community } from './community';
import { User } from '../users/user';

export interface CommunityResponse extends Community {
  skills?: Skill[];
  managers: User[];
}
