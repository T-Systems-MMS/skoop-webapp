export interface UserSkillPriorityAggregationView {
  skill: {
    id: string;
    name: string;
  };
  averagePriority: number;
  maximumPriority: number;
  userCount: number;
}
