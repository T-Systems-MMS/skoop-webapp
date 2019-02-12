import { Skill } from '../skills/skill';
import { Community } from './community';

export interface CommunityResponse extends Community{
  skills?: Skill[];
}
