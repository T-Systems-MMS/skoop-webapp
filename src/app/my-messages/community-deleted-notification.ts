import { AbstractCommunityNotification } from './abstract-community-notification';

export class CommunityDeletedNotification extends AbstractCommunityNotification {
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
