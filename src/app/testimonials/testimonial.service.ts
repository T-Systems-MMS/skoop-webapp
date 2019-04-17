import { Injectable } from '@angular/core';
import { UserIdentityService } from '../shared/user-identity.service';
import { HttpClient } from '@angular/common/http';
import { Testimonial } from './testimonial';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  private testimonialsUrlPattern = `${environment.serverApiUrl}/users/{userId}/testimonials`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  createTestimonial(testimonial: Testimonial): Observable<Testimonial> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<Testimonial>(this.testimonialsUrlPattern.replace('{userId}', userIdentity.userId), testimonial)));
  }
}
