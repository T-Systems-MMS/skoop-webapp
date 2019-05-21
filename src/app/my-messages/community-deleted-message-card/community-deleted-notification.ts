import { AbstractNotification } from '../abstract-notification';

export interface CommunityDeletedNotification extends AbstractNotification {
  communityName: string;
}
