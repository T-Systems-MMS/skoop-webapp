import { User } from '../users/user';
import { Project } from '../projects/project';
import { Moment } from 'moment';
import { Skill } from '../skills/skill';

export interface UserProject {
  id: number;
  role: string;
  tasks: string;
  startDate: Moment;
  endDate: Moment;
  creationDate: Moment;
  lastModifiedDate: Moment;
  user: User;
  project: Project;
  skills: Skill[];
}
