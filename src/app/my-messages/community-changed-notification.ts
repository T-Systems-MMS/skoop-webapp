import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';

export class CommunityChangedNotification extends AbstractNotification {
  community: Community;
  communityName: string;

  getTypeText(): string {
    return 'Changes in the community details';
  }
}
