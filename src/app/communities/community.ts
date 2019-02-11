import { Link } from './link';
import { CommunityType } from './community-type.enum';

export interface Community {
  id: string;
  title: string;
  description?: string;
  type: CommunityType;
  links?: Link[];
}
