import { Moment } from 'moment';

export interface UpdateUserProjectRequest {
  role: string;
  tasks: string;
  startDate: Moment;
  endDate: Moment;
  skills?: string[];
  approved?: boolean;
}
