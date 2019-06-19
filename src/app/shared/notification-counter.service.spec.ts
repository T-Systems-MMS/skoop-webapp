import { TestBed } from '@angular/core/testing';

import { NotificationCounterService } from './notification-counter.service';
import { UserIdentity } from './user-identity';
import { UserIdentityService } from './user-identity.service';
import { of } from 'rxjs';
import { MessagesService } from '../my-messages/messages.service';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

const messageCount = 129;

describe('NotificationCounterService', () => {
  let notificationCounterService: NotificationCounterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationCounterService,
        {
          provide: UserIdentityService,
          useValue: jasmine.createSpyObj('userIdentityService', {'getUserIdentity': of(authenticatedUser)})
        },
        {
          provide: MessagesService,
          useValue: jasmine.createSpyObj('messageService', {'getUserNotificationCounter': of(messageCount)})
        }
      ]
    });

    notificationCounterService = TestBed.get(NotificationCounterService);
  });

  it('should be created', () => {
    expect(notificationCounterService).toBeTruthy();
  });

  it('should return expected count of notifications', () => {
    notificationCounterService.getCount().subscribe(data => {
      expect(data).toBe(messageCount);
    });
  });

  it('should call messageService.getUserNotificationCounter method', () => {
    notificationCounterService.loadCount();
    const messageService = TestBed.get(MessagesService);
    expect(messageService.getUserNotificationCounter).toHaveBeenCalled();
  });
});
