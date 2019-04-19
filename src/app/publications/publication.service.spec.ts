import { async, TestBed } from '@angular/core/testing';

import { PublicationService } from './publication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { UserIdentity } from '../shared/user-identity';
import { environment } from '../../environments/environment';
import { PublicationRequest } from './publication-request';
import { PublicationResponse } from './publication-response';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

describe('PublicationService', () => {
  let httpTestingController: HttpTestingController;
  let publicationService: PublicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicationService,
        { provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })}
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    publicationService = TestBed.get(PublicationService);
  });

  it('should be created', () => {
    expect(publicationService).toBeTruthy();
  });

  it('should create the publication with the given data', async(() => {
    const publicationRequest: PublicationRequest = {
      title: 'Publication title',
      date: new Date(),
      publisher: 'Publisher',
      link: 'https://www.google.com',
      skills: ['Skill1', 'Skill2']
    };

    const publicationResponse: PublicationResponse = {
      id: '123123123123123',
      title: publicationRequest.title,
      date: publicationRequest.date,
      publisher: publicationRequest.publisher,
      link: publicationRequest.link,
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

    publicationService.createPublication(publicationRequest).subscribe(actualData => {
      expect(actualData).toEqual(publicationResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/publications`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(publicationRequest);

    request.flush(publicationResponse);
  }));

  // it('should provide list of testimonials', async(() => {
  //   const testimonialsResponse: TestimonialResponse[] = [
  //     {
  //       id: '123123123123123',
  //       author: 'Author 1',
  //       comment: 'Comment 1',
  //       skills: [
  //         {
  //           id: '1231231',
  //           name: 'Skill1'
  //         },
  //         {
  //           id: '4325345345',
  //           name: 'Skill2'
  //         },
  //       ]
  //     },
  //     {
  //       id: '42342352452312434532',
  //       author: 'Author 2',
  //       comment: 'Comment 2',
  //       skills: [
  //         {
  //           id: '1231231',
  //           name: 'Skill1'
  //         },
  //         {
  //           id: '4325345345',
  //           name: 'Skill2'
  //         },
  //       ]
  //     }
  //   ];
  //
  //   publicationService.getTestimonials().subscribe(actualData => {
  //     expect(actualData).toEqual(testimonialsResponse);
  //   });
  //
  //   const request = httpTestingController.expectOne({
  //     method: 'GET',
  //     url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/testimonials`
  //   });
  //
  //   expect(request.request.responseType).toEqual('json');
  //
  //   request.flush(testimonialsResponse);
  // }));

  it('should update the publication with the given data', async(() => {
    const publicationRequest: PublicationRequest = {
      id: '123123123123123',
      title: 'Publication title',
      date: new Date(),
      publisher: 'Publisher',
      link: 'https://www.google.com',
      skills: ['Skill1', 'Skill2']
    };

    const publicationResponse: PublicationResponse = {
      id: publicationRequest.id,
      title: publicationRequest.title,
      date: publicationRequest.date,
      publisher: publicationRequest.publisher,
      link: publicationRequest.link,
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

    publicationService.editPublication(publicationRequest).subscribe(actualData => {
      expect(actualData).toEqual(publicationResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/publications/${publicationRequest.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(publicationRequest);

    request.flush(publicationResponse);
  }));

  // it('should delete the testimonial by its id', async(() => {
  //   const testimonialId = '1231242134134124';
  //   publicationService.deleteTestimonial(testimonialId).subscribe(actualData => {
  //     expect(actualData).toBeNull();
  //   });
  //
  //   const request = httpTestingController.expectOne({
  //     method: 'DELETE',
  //     url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/testimonials/${testimonialId}`
  //   });
  //
  //   expect(request.request.responseType).toEqual('json');
  //
  //   request.flush(null);
  // }));
});
