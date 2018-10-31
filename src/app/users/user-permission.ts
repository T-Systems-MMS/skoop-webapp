import { User } from './user';
import { UserPermissionScope } from './user-permission-scope';

export interface UserPermission {
  owner: User;
  scope: UserPermissionScope;
  authorizedUsers: User[];
}
