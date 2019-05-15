import { CommunityRole } from '../communities/community-role.enum';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class CommunityRoleChangedNotification extends AbstractCommunityNotification {
  communityName: string;
  role: CommunityRole;

  getTypeText(): string {
    return 'The community role changed.';
  }

  getHtmlMessageText(): string {
    return `Your role was changed to ${this.role}`;
  }

  getCommunityInfo(): string{
    return this.communityName;
  }
}
