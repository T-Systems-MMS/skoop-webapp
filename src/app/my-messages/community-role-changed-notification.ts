import { AbstractNotification } from './abstract-notification';
import { CommunityRole } from '../communities/community-role.enum';

export class CommunityRoleChangedNotification extends AbstractNotification {
  communityName: string;
  role: CommunityRole;

  getTypeText(): string {
    return 'The community role changed.';
  }

  getMessageText(): string {
    return `Your role was changed to ${this.role}`
  }
}
