import { AbstractNotification } from './abstract-notification';

export class UserWelcomeNotification extends AbstractNotification {

  getTypeText(): string {
    return 'Welcome notification';
  }

  isToDoType(): boolean {
    return false;
  }
}
