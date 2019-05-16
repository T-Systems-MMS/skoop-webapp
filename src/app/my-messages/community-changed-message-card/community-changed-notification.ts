import { Community } from '../../communities/community';
import { CommunityDetails } from './community-details.enum';
import { AbstractNotification } from '../abstract-notification';

export class CommunityChangedNotification extends AbstractNotification {
  community: Community;
  communityName: string;
  communityDetails: CommunityDetails[];

  getTypeText(): string {
    return 'Changes in the community details';
  }

  private getChanges() {
    return `${this.communityDetails.map(item => CommunityDetails[item]).join(', ')} changed`;
  }

  getHtmlMessageText(): string {
    return this.community ? `<a href="/communities/${this.community.id}">${this.community.title}</a> ${this.getChanges()}`
      : `<strong>${this.communityName}</strong> ${this.getChanges()}`;
  }

  getCommunityInfo(): string {
    return this.community ? `<a href="/communities/${this.community.id}">${this.community.title}</a>`
      : this.communityName;
  }
}
