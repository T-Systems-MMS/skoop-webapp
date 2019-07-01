import {Moment} from 'moment';

export interface Membership {
  id?: string;
  name: string;
  description?: string;
  startDate?: Moment;
  endDate?: Moment;
  link?: string;
}
