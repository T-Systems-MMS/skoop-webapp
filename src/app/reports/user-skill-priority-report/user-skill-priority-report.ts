export interface UserSkillPriorityReport {
  id: string;
  date: Date;
  aggregationReports: UserSkillPriorityAggregationReport[];
}

export interface UserSkillPriorityAggregationReport {
  id: string;
  averagePriority: number;
  maximumPriority: number;
  userCount: number;
  skillName: string;
  skillDescription: string;
}
