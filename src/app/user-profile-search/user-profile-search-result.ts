import { User } from '../users/user';

export interface UserProfileSearchResult extends User {
  manager?: User;
}
