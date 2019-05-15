import { AbstractNotification } from './abstract-notification';

export abstract class AbstractCommunityNotification extends AbstractNotification {

  abstract isToDoType(): boolean;
}
