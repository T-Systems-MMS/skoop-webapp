import { NotificationType } from './notification-type.enum';

export interface AbstractNotification {
  id: string;
  creationDatetime: Date;
  type: NotificationType;
}
