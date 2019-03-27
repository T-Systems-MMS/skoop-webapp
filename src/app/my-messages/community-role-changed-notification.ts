import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';

export class CommunityRoleChangedNotification extends AbstractNotification {
  community: Community;

  getTypeText(): string {
    return 'Changes community-role';
  }
}
