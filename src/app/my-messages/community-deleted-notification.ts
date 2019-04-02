import { AbstractNotification } from './abstract-notification';

export class CommunityDeletedNotification extends AbstractNotification {
  communityName: string;

  getTypeText(): string {
    return 'Deletion of a community';
  }
}
