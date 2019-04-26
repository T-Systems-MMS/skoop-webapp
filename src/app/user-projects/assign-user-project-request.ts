import { UpdateUserProjectRequest } from './update-user-project-request';

export interface AssignUserProjectRequest extends UpdateUserProjectRequest {
  projectName: string;
}
