import { Community } from './community';

export interface CommunityRequest extends Community {
  skillNames?: string[];
  invitedUserIds?: string[];
}
