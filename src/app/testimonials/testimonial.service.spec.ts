import { TestBed } from '@angular/core/testing';

import { TestimonialService } from './testimonial.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';

describe('TestimonialService', () => {
  let httpTestingController: HttpTestingController;
  let testimonialService: TestimonialService;

  const authenticatedUser: UserIdentity = {
    userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'tester',
    firstName: 'Toni',
    lastName: 'Tester',
    email: 'toni.tester@skoop.io',
    roles: ['ROLE_USER']
  };

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
});
