import { AbstractNotification } from './abstract-notification';
import { Community } from '../communities/community';
import { CommunityDetails } from './community-details.enum';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class CommunityChangedNotification extends AbstractCommunityNotification {
  community: Community;
  communityName: string;
  communityDetails: CommunityDetails[];

  getTypeText(): string {
    return 'Changes in the community details';
  }

  isToDoType(): boolean {
    return false;
  }

  getMessageText() {
    return `${this.communityDetails.map(item => CommunityDetails[item]).join(', ')} changed`;
  }

  getHtmlMessageText(): string {
    return '';
  }
}
