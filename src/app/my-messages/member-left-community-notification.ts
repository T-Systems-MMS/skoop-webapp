import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';
import { User } from '../users/user';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class MemberLeftCommunityNotification extends AbstractCommunityNotification {
  community: Community;
  communityName: string;
  user: User;

  getTypeText(): string {
    return 'A member leaving a community';
  }

  isToDoType(): boolean {
    return false;
  }

  getHtmlMessageText(): string {
    return '';
  }
}
