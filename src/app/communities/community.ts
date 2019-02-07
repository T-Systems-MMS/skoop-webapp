import { Link } from './link';

export interface Community {
  id: string;
  title: string;
  description?: string;
  links?: Link[];
}
