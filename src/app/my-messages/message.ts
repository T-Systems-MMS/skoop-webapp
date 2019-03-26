import { MessageType } from './message-type.enum';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { Community } from '../communities/community';

export interface Message {
  id: string;
  creationDatetime: Date;
  type: MessageType;
  community?: Community;
  registration?: CommunityUserRegistrationResponse;
  attributes?: any;
}
