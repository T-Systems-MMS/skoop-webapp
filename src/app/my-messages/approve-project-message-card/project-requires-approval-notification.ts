import { AbstractNotification } from '../abstract-notification';
import { UserProject } from '../../user-projects/user-project';

export interface ProjectRequiresApprovalNotification extends AbstractNotification {
  userProjects: UserProject[];
}
