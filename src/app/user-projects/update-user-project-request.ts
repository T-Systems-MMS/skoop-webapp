import { Moment } from 'moment';

export class UpdateUserProjectRequest {
  role: string;
  tasks: string;
  startDate: Moment;
  endDate: Moment;
}
