import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {MessagesService} from '../my-messages/messages.service';
import {UserIdentityService} from './user-identity.service';
import {switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationCounterService {

  private notificationCount = 0;
  private subject = new Subject<number>();

  constructor(private messagesService: MessagesService,
              private userIdentityService: UserIdentityService) {
  }

  setCount(count: number) {
    this.notificationCount = count;
    this.subject.next(count);
  }

  decrementCount() {
    this.notificationCount--;
    this.subject.next(this.notificationCount);
  }

  getCount(): Observable<number> {
    // return this.subject.asObservable();
    return this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => {
        return this.messagesService.getUserNotificationCounter(userIdentity.userId).pipe(tap(counter => {
          this.notificationCount = counter;
        }));
      }));
  }
}
