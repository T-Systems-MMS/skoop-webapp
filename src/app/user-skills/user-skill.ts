import { Skill } from '../skills/skill';

export interface UserSkill {
  skill: Skill;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
  favorite?: boolean;
}
