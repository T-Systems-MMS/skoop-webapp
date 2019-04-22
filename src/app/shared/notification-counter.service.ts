import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MessagesService } from '../my-messages/messages.service';
import { UserIdentityService } from './user-identity.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationCounterService {

  private notificationCount = 0;
  private subject = new Subject<number>();

  constructor(private messagesService: MessagesService,
              private userIdentityService: UserIdentityService) {
  }

  decrementCount() {
    this.notificationCount--;
    this.subject.next(this.notificationCount);
  }

  getCount(): Observable<number> {
    this.userIdentityService.getUserIdentity().subscribe(userIdentity => {
      this.messagesService.getUserNotificationCounter(userIdentity.userId)
        .subscribe(counter => {
          this.notificationCount = counter;
          this.subject.next(counter);
        });
    });

    return this.subject.asObservable();
  }
}
