import { AbstractNotification } from './abstract-notification';

export class UserWelcomeNotification extends AbstractNotification {

  getTypeText(): string {
    return "";
  }

  isToDoType(): boolean {
    return false;
  }
}
