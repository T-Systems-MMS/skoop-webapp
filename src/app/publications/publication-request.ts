import { Publication } from './publication';

export interface PublicationRequest extends Publication {
  skills?: string[];
}
