import { Injectable } from '@angular/core';
import { UserIdentityService } from '../shared/user-identity.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TestimonialRequest } from './testimonial-request';
import { TestimonialResponse } from './testimonial-response';


@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  private testimonialsUrlPattern = `${environment.serverApiUrl}/users/{userId}/testimonials`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  createTestimonial(testimonial: TestimonialRequest): Observable<TestimonialResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<TestimonialResponse>(this.testimonialsUrlPattern.replace('{userId}', userIdentity.userId), testimonial)));
  }
}
