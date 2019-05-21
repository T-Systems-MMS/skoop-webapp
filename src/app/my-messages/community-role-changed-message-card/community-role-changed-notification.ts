import { CommunityRole } from '../../communities/community-role.enum';
import { AbstractNotification } from '../abstract-notification';

export interface CommunityRoleChangedNotification extends AbstractNotification {
  communityName: string;
  role: CommunityRole;
}
