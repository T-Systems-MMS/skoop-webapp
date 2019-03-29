import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';

export class CommunityDeletedNotification extends AbstractNotification {
  community: Community;

  getTypeText(): string {
    return 'Deletion of a community';
  }
}
