import { Moment } from 'moment';

export interface AssignUserProjectRequest {
  projectId: string;
  role: string;
  tasks: string;
  startDate: Moment;
  endDate: Moment;
}
