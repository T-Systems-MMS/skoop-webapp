import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { UserIdentity } from '../shared/user-identity';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@myskills.io',
  roles: ['ROLE_USER']
};

describe('MessagesService', () => {
  let httpTestingController: HttpTestingController;
  let messagesService: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagesService,
        {
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })
        }]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    messagesService = TestBed.get(MessagesService);
  });

  it('should be created', () => {
    const service: MessagesService = TestBed.get(MessagesService);
    expect(service).toBeTruthy();
  });
});
