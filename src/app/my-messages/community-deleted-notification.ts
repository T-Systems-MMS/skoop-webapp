import { AbstractNotification } from './abstract-notification';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class CommunityDeletedNotification extends AbstractCommunityNotification {
  communityName: string;

  getTypeText(): string {
    return 'Deletion of a community';
  }

  isToDoType(): boolean {
    return false;
  }

  getHtmlMessageText(): string {
    return '';
  }
}
