import { Community } from '../../communities/community';
import { AbstractNotification } from '../abstract-notification';

export class MemberKickedOutNotification extends AbstractNotification {
  community: Community;
  communityName: string;

  getTypeText(): string {
    return 'The user was kicked out of the community';
  }

  getHtmlMessageText(): string {
    return 'The user was kicked out of the community';
  }

  getCommunityInfo(): string {
    return this.community ? `<a href="/communities/${this.community.id}">${this.community.title}</a>`
      : this.communityName;
  }
}
