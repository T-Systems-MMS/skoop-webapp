import { Community } from './community';

export interface CommunityRequest extends Community {
  skillNames?: string[];
  managerIds: string[];
  memberIds: string[];
}
