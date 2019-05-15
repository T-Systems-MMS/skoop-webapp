import { AbstractNotification } from './abstract-notification';

export abstract class AbstractCommunityNotification extends AbstractNotification {

  abstract getCommunityInfo(): string;
}
