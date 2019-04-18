import { Testimonial } from './testimonial';
import { Skill } from '../skills/skill';

export interface TestimonialResponse extends Testimonial {
  skills?: Skill[];
}
