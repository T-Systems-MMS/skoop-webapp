import { Community } from '../communities/community';
import { User } from '../users/user';
import { AbstractCommunityNotification } from './abstract-community-notification';

export class MemberLeftCommunityNotification extends AbstractCommunityNotification {
  community: Community;
  communityName: string;
  user: User;

  getTypeText(): string {
    return 'A member leaving a community';
  }

  getHtmlMessageText(): string {
    return 'A member leaving a community';
  }

  getCommunityInfo(): string {
    return this.community ? `<a href="/communities/${this.community.id}">${this.community.title}</a>`
      : this.communityName;
  }

  getUser(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
