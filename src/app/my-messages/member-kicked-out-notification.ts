import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';

export class MemberKickedOutNotification extends AbstractNotification {
  community: Community;
  communityName: string;

  getTypeText(): string {
    return 'The user was kicked out of the community';
  }

  isToDoType(): boolean {
    return false;
  }
}
