import { Membership } from './membership';
import { Skill } from '../skills/skill';

export interface MembershipResponse extends Membership {
  skills: Skill[];
}
