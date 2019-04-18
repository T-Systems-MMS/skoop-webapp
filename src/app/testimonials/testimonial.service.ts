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
  private testimonialUrlPattern = `${environment.serverApiUrl}/users/{userId}/testimonials/{testimonialIs}`;

  constructor(private httpClient: HttpClient,
              private userIdentityService: UserIdentityService) {
  }

  getTestimonials(): Observable<TestimonialResponse[]> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.get<TestimonialResponse[]>(this.testimonialsUrlPattern.replace('{userId}', userIdentity.userId))));
  }

  createTestimonial(testimonial: TestimonialRequest): Observable<TestimonialResponse> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.post<TestimonialResponse>(this.testimonialsUrlPattern.replace('{userId}', userIdentity.userId), testimonial)));
  }

  deleteTestimonial(testimonialId: string): Observable<void> {
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity =>
        this.httpClient.delete<void>(this.testimonialUrlPattern
          .replace('{userId}', userIdentity.userId).replace('{testimonialId', testimonialId))));
  }
}
