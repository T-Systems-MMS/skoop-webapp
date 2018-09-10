export interface UserSkillPriorityReportDetailsResponse {
    id: String;
    averagePriority: number;
    maximumPriority: number;
    userCount: number;
    skill: SkillReport;
}

export interface SkillReport {
    id: string;
    name: string;
    description?: string;
}
