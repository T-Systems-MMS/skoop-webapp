import { Community } from '../../communities/community';
import { CommunityDetails } from './community-details.enum';
import { AbstractNotification } from '../abstract-notification';

export interface CommunityChangedNotification extends AbstractNotification {
  community: Community;
  communityName: string;
  communityDetails: CommunityDetails[];
}
