import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';

export class MemberKickedOutNotification extends AbstractNotification {
  community: Community;

  getTypeText(): string {
    return 'The user was kicked out of the community';
  }
}
