export interface UserIdentity {
  userId: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles: string[];
  notificationCount?: number;
}
