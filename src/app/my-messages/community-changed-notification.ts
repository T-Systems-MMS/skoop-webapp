import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';
import { CommunityDetails } from './community-details.enum';

export class CommunityChangedNotification extends AbstractNotification {
  community: Community;
  communityName: string;
  communityDetails: CommunityDetails[];

  getTypeText(): string {
    return 'Changes in the community details';
  }

  getMessageText() {
    return `${this.communityDetails.map(item => CommunityDetails[item]).join(', ')} changed`;
  }
}
