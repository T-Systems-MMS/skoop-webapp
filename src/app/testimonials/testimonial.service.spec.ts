import { async, TestBed } from '@angular/core/testing';

import { TestimonialService } from './testimonial.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { TestimonialRequest } from './testimonial-request';
import { TestimonialResponse } from './testimonial-response';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

describe('TestimonialService', () => {
  let httpTestingController: HttpTestingController;
  let testimonialService: TestimonialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TestimonialService,
        { provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })}
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    testimonialService = TestBed.get(TestimonialService);
  });

  it('should be created', () => {
    expect(testimonialService).toBeTruthy();
  });

  it('should create the testimonial with the given data', async(() => {
    const testimonialRequest: TestimonialRequest = {
      author: 'author of the testimonial',
      comment: 'comment of the testimonial',
      skills: ['Skill1', 'Skill2']
    };

    const testimonialResponse: TestimonialResponse = {
      id: '123123123123123',
      author: testimonialRequest.author,
      comment: testimonialRequest.comment,
      skills: [
        {
          id: '1231231',
          name: 'Skill1'
        },
        {
          id: '4325345345',
          name: 'Skill2'
        },
      ]
    };

    testimonialService.createTestimonial(testimonialRequest).subscribe(actualData => {
      expect(actualData).toEqual(testimonialResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/testimonials`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(testimonialRequest);

    request.flush(testimonialResponse);
  }));

  it('should provide list of testimonials', async(() => {
    const testimonialsResponse: TestimonialResponse[] = [
      {
        id: '123123123123123',
        author: 'Author 1',
        comment: 'Comment 1',
        skills: [
          {
            id: '1231231',
            name: 'Skill1'
          },
          {
            id: '4325345345',
            name: 'Skill2'
          },
        ]
      },
      {
        id: '42342352452312434532',
        author: 'Author 2',
        comment: 'Comment 2',
        skills: [
          {
            id: '1231231',
            name: 'Skill1'
          },
          {
            id: '4325345345',
            name: 'Skill2'
          },
        ]
      }
    ];

    testimonialService.getTestimonials().subscribe(actualData => {
      expect(actualData).toEqual(testimonialsResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/testimonials`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(testimonialsResponse);
  }));

  it('should update the testimonial with the given data', async(() => {
    const testimonialRequest: TestimonialRequest = {
      id: '123123123123123',
      author: 'author of the testimonial',
      comment: 'comment of the testimonial',
      skills: ['Skill1', 'Skill2']
    };

    const testimonialResponse: TestimonialResponse = {
      id: testimonialRequest.id,
      author: testimonialRequest.author,
      comment: testimonialRequest.comment,
      skills: [
        {
          id: '1231231',
          name: 'Skill1'
        },
        {
          id: '4325345345',
          name: 'Skill2'
        },
      ]
    };

    testimonialService.updateTestimonial(testimonialRequest).subscribe(actualData => {
      expect(actualData).toEqual(testimonialResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/testimonials/${testimonialRequest.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(testimonialRequest);

    request.flush(testimonialResponse);
  }));

  it('should delete the testimonial by its id', async(() => {
    const testimonialId = '1231242134134124';
    testimonialService.deleteTestimonial(testimonialId).subscribe(actualData => {
      expect(actualData).toBeNull();
    });

    const request = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/testimonials/${testimonialId}`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(null);
  }));
});
