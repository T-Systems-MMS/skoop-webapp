import { CommonPermissionResponse } from './common-permission-response';
import { GlobalPermissionScope } from './global-permission-scope.enum';

export interface GlobalUserPermissionResponse extends CommonPermissionResponse {
  scope: GlobalPermissionScope;
}
