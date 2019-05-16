import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AbstractNotification } from './abstract-notification';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private messagesUrlPattern = `${environment.serverApiUrl}/users/{userId}/notifications`;
  private messageUrlPattern = `${environment.serverApiUrl}/notifications/{notificationId}`;
  private messageCounterUrlPatter = `${environment.serverApiUrl}/users/{userId}/notification-counter`;

  constructor(private httpClient: HttpClient) {
  }

  getUserNotifications<T extends AbstractNotification>(userId: string): Observable<T[]> {
    return this.httpClient.get<T[]>(this.messagesUrlPattern.replace('{userId}', userId));
  }

  getUserNotificationCounter(userId: string): Observable<number> {
    return this.httpClient.get<number>(this.messageCounterUrlPatter.replace('{userId}', userId));
  }

  delete(notificationId: string): Observable<void> {
    return this.httpClient.delete<void>(this.messageUrlPattern.replace('{notificationId}', notificationId));
  }
}
