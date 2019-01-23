import { CurrentSkillLevel } from './current-skill-level';

export interface AnonymousUserSkill {
  userReferenceId: string;
  skills: CurrentSkillLevel[];
}
