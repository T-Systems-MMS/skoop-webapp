import { AbstractNotification } from '../abstract-notification';

export class CommunityDeletedNotification extends AbstractNotification {
  communityName: string;

  getTypeText(): string {
    return 'Deletion of a community';
  }

  getHtmlMessageText(): string {
    return 'Community was deleted';
  }

  getCommunityInfo(): string {
    return this.communityName;
  }
}
