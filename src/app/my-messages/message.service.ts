import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private notificationsUrlPattern = `${environment.serverApiUrl}/notifications`;

  constructor(private httpClient: HttpClient) {
  }

  getMessages(userId: string): Observable<Message[]> {
    // return of(userMessages);
    return this.httpClient.get<Message[]>(this.notificationsUrlPattern);
  }
}
