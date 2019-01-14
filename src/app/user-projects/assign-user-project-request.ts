import { Moment } from 'moment';

export class AssignUserProjectRequest {
  projectId: string;
  role: string;
  tasks: string;
  startDate: Moment;
  endDate: Moment;
}
