import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';

export class MemberLeftCommunityNotification extends AbstractNotification {
  community: Community;

  getTypeText(): string {
    return 'A member leaving a community';
  }
}
