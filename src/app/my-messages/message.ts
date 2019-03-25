import { Community } from '../communities/community';
import { MessageType } from './message-type.enum';
import { CommunityUserRegistration } from '../shared/community-user-registration';

export interface Message {
  id: string;
  creationDatetime: Date;
  type: MessageType;
  community?: Community;
  registration?: CommunityUserRegistration;
  attributes?: any;
}
