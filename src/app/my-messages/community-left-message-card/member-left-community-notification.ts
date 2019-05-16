import { Community } from '../../communities/community';
import { User } from '../../users/user';
import { AbstractNotification } from '../abstract-notification';

export interface MemberLeftCommunityNotification extends AbstractNotification {
  community: Community;
  communityName: string;
  user: User;
}
