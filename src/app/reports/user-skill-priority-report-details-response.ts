export interface UserSkillPriorityReportDetailsResponse {
    id: String;
    skill: SkillReport;
    averagePriority: number;
    maximumPriority: number;
    userCount: number;
}

export interface SkillReport {
    id: string;
    name: string;
    description?: string;
}
