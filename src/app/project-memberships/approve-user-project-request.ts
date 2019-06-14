import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';

export interface ApproveUserProjectRequest extends UpdateUserProjectRequest {
  projectId: string;
}
