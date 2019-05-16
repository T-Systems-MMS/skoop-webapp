import { Community } from '../../communities/community';
import { AbstractNotification } from '../abstract-notification';

export interface MemberKickedOutNotification extends AbstractNotification {
  community: Community;
  communityName: string;
}
