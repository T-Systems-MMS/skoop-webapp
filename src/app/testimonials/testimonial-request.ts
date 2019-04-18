import { Testimonial } from './testimonial';

export interface TestimonialRequest extends Testimonial {
  skills?: string[];
}
