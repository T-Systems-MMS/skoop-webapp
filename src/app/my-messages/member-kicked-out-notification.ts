import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class MemberKickedOutNotification extends AbstractCommunityNotification {
  community: Community;
  communityName: string;

  getTypeText(): string {
    return 'The user was kicked out of the community';
  }

  isToDoType(): boolean {
    return false;
  }

  getHtmlMessageText(): string {
    return '';
  }
}
