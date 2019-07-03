import { SkillView } from './skill-view';

export interface UserSkillView {
  skill: SkillView;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
  favorite?: boolean
}
