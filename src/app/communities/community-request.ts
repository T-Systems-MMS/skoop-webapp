import { Community } from './community';

export interface CommunityRequest extends Community {
  skillIds?: string[];
  managerIds: string[];
  memberIds: string[];
}
