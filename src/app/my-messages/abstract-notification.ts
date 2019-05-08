import { NotificationType } from './notification-type.enum';

export abstract class AbstractNotification {
  id: string;
  creationDatetime: Date;
  type: NotificationType;

  abstract getTypeText(): string;

  abstract isToDoType(): boolean;

  hasAcceptanceToCommunityType(): boolean {
    return this.type === NotificationType.ACCEPTANCE_TO_COMMUNITY;
  }

  hasCommunityChangedType(): boolean {
    return this.type === NotificationType.COMMUNITY_CHANGED;
  }

  hasCommunityDeletedType(): boolean {
    return this.type === NotificationType.COMMUNITY_DELETED;
  }

  hasCommunityInvitationType(): boolean {
    return this.type === NotificationType.INVITATION_TO_JOIN_COMMUNITY;
  }

  hasCommunityRoleChangedType(): boolean {
    return this.type === NotificationType.COMMUNITY_ROLE_CHANGED;
  }

  hasJoinCommunityType(): boolean {
    return this.type === NotificationType.REQUEST_TO_JOIN_COMMUNITY;
  }

  hasMemberKickedOutType(): boolean {
    return this.type === NotificationType.MEMBER_KICKED_OUT_OF_COMMUNITY;
  }

  hasMemberLeftType(): boolean {
    return this.type === NotificationType.MEMBER_LEFT_COMMUNITY;
  }

  hasUserWelcomeNotificationType(): boolean {
    return this.type === NotificationType.USER_WELCOME_NOTIFICATION;
  }

}
