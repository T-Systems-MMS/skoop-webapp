import { Skill } from '../skills/skill';

export interface UserSkillPriorityAggregation {
  skill: Skill;
  averagePriority: number;
  maximumPriority: number;
  userCount: number;
}
