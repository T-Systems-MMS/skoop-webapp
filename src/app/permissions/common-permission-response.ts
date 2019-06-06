import { UserPermissionScope } from '../users/user-permission-scope';
import { User } from '../users/user';

export interface CommonPermissionResponse {
  scope: UserPermissionScope;
  owner: User;
}
