import { User } from './user';
import { CommonPermissionResponse } from '../permissions/common-permission-response';
import { UserPermissionScope } from './user-permission-scope';

export interface UserPermissionResponse extends CommonPermissionResponse {
  scope: UserPermissionScope;
  authorizedUsers: User[];
}
