import { User } from '../users/user';
import { Community } from '../communities/community';
import { MessageStatus } from './message-status.enum';
import { MessageType } from './message-type.enum';

export interface Message {

  id: string;
  initiator: User;
  recipient: User;
  community: Community;
  creationDatetime: Date;
  status: MessageStatus;
  type: MessageType;
}
