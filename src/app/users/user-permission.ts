import { User } from './user';
import { CommonPermissionResponse } from '../permissions/common-permission-response';

export interface UserPermission extends CommonPermissionResponse {
  authorizedUsers: User[];
}
