import * as moment from 'moment';
import { Moment } from 'moment';
import { UserProject } from '../user-projects/user-project';
import { AbstractNotification } from '../my-messages/abstract-notification';
import { NotificationType } from '../my-messages/notification-type.enum';
import { AcceptanceToCommunityNotification } from '../my-messages/acceptance-to-community-notification';
import { CommunityChangedNotification } from '../my-messages/community-changed-notification';
import { CommunityDeletedNotification } from '../my-messages/community-deleted-notification';
import { CommunityInvitationNotification } from '../my-messages/community-invitation-notification';
import { CommunityRoleChangedNotification } from '../my-messages/community-role-changed-notification';
import { JoinCommunityRequestNotification } from '../my-messages/join-community-request-notification';
import { MemberKickedOutNotification } from '../my-messages/member-kicked-out-notification';
import { MemberLeftCommunityNotification } from '../my-messages/member-left-community-notification';
import { Publication } from '../publications/publication';

export class Util {

  /**
   * Sets the timezone to UTC without applying any timezone offset.
   * For example for 2000-01-01T00:00+02 (CEST) the method will return 2000-01-01T00:00Z (UTC).
   *
   * @param - {Moment} originalDate
   * @returns - {Moment}
   */
  public static ignoreTimezone(originalDate: Moment | Date): Moment {
    if (originalDate == null) {
      return null;
    } else {
      return moment(originalDate).utc(true);
    }
  }

  static injectNow(supplier: () => Moment) {
    Util.now = supplier;
  }

  private static now: () => Moment = () => Util.ignoreTimezone(moment());

  public static datesAreConsistent(userProject: UserProject): boolean {
    const from = Util.ignoreTimezone(userProject.startDate);
    const to = Util.ignoreTimezone(userProject.endDate);
    if (to == null) {
      return true;
    }

    if (from == null) {
      const today: Moment = Util.now().startOf('day');
      return !today.isAfter(to);
    } else {
      return !from.isAfter(to);
    }
  }

  public static dateIsInPast(publication: Publication): boolean {
    if (!publication.date || !publication.date.toString()) {
      return true;
    }

    const publicationDate = Util.ignoreTimezone(publication.date);

    const tomorrow: Moment = Util.now().startOf('day').add(1, 'day');
    return tomorrow.isAfter(publicationDate);
  }

  /**
   * Creates notification instance according to its type
   */
  public static createNotificationInstance<T extends AbstractNotification>(notification: any): T {
    switch (notification.type) {
      case NotificationType.ACCEPTANCE_TO_COMMUNITY:
        return Object.assign(new AcceptanceToCommunityNotification(), notification);
      case NotificationType.COMMUNITY_CHANGED:
        return Object.assign(new CommunityChangedNotification(), notification);
      case NotificationType.COMMUNITY_DELETED:
        return Object.assign(new CommunityDeletedNotification(), notification);
      case NotificationType.INVITATION_TO_JOIN_COMMUNITY:
        return Object.assign(new CommunityInvitationNotification(), notification);
      case NotificationType.COMMUNITY_ROLE_CHANGED:
        return Object.assign(new CommunityRoleChangedNotification(), notification);
      case NotificationType.REQUEST_TO_JOIN_COMMUNITY:
        return Object.assign(new JoinCommunityRequestNotification(), notification);
      case NotificationType.MEMBER_KICKED_OUT_OF_COMMUNITY:
        return Object.assign(new MemberKickedOutNotification(), notification);
      case NotificationType.MEMBER_LEFT_COMMUNITY:
        return Object.assign(new MemberLeftCommunityNotification(), notification);
      default:
        return null;
    }
  }

}
