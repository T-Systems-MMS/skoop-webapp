import { SkillReportSimple } from '../shared/skill-report-simple';

export interface UserSkillPriorityReport {
  id: string;
  date: string;
  aggregationReports: {
    id: string;
    averagePriority: number;
    maximumPriority: number;
    userCount: number;
    skill: SkillReportSimple;
  }[];
}
