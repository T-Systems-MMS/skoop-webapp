import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationCounterService {

  private notificationCount = 0;
  private subject = new Subject<number>();

  constructor() {
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
    return this.subject.asObservable();
  }
}
