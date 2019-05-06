import { UserPermissionScope } from '../users/user-permission-scope';

export interface UserPermissionRequest {
  scope: UserPermissionScope;
  authorizedUserIds?: string[];
}
