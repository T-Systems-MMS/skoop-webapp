import { SkillReportSimple } from './skill-report-simple';
import { UserReportSimple } from './user-report-simple';

export interface UserSkillReport {
  id: string;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
  skill: SkillReportSimple;
  user: UserReportSimple;
}
