import { GlobalUserPermission } from './global-user-permission';
import { User } from '../users/user';

export interface GlobalUserPermissionResponse extends GlobalUserPermission {
  owner: User;
}
