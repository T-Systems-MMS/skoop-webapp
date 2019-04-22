import { Membership } from './membership';

export interface MembershipRequest extends Membership {
  skills: string[];
}
