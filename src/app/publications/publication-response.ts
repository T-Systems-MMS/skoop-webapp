import { Publication } from './publication';
import { Skill } from '../skills/skill';

export interface PublicationResponse extends Publication {
  skills?: Skill[];
}
