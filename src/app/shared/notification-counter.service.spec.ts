import { TestBed } from '@angular/core/testing';

import { NotificationCounterService } from './notification-counter.service';

describe('NotificationCounterService', () => {
  let notificationCounterService: NotificationCounterService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationCounterService]
    });

    notificationCounterService = TestBed.get(NotificationCounterService);
  });

  it('should be created', () => {
    expect(notificationCounterService).toBeTruthy();
  });

  it('should set count of notifications', () => {
    const expectedCount = 123;
    notificationCounterService.getCount().subscribe(data => {
      expect(data).toBe(expectedCount);
    });

    notificationCounterService.setCount(expectedCount);
  });

  it('should decrement count of notifications', () => {
    const expectedCount = 123;
    notificationCounterService.setCount(expectedCount);
    notificationCounterService.getCount().subscribe(data => {
      expect(data).toBe(expectedCount - 1);
    });

    notificationCounterService.decrementCount();
  });
});
