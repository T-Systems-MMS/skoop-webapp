import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from './message';
import { MessageStatus } from './message-status.enum';
import { MessageType } from './message-type.enum';
import { CommunityType } from '../communities/community-type.enum';

const userMessages: Message[] = [
  {
    id: '1',
    initiator: {
      id: '1',
      firstName: 'some',
      lastName: 'user',
      userName: 'fila'

    },
    recipient:  {
      id: '4fc55946-96d6-4306-883c-5480917bfad9',
      firstName: 'firstName',
      lastName: 'lastNmae',
      userName: 'fila'

    },
    status: MessageStatus.PENDING,
    type: MessageType.COMMUNITY_JOIN_REQUEST,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.CLOSED
    },
    creationDatetime: new Date()
  },
  {
    id: '12',
    initiator: {
      id: '1',
      firstName: 'some',
      lastName: 'user',
      userName: 'fila'

    },
    recipient:  {
      id: '4fc55946-96d6-4306-883c-5480917bfad9',
      firstName: 'firstName',
      lastName: 'lastNmae',
      userName: 'fila'

    },
    status: MessageStatus.ACCEPTED,
    type: MessageType.COMMUNITY_JOIN_REQUEST,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.CLOSED
    },
    creationDatetime: new Date()
  },
  {
    id: '1',
    initiator: {
      id: '1',
      firstName: 'some',
      lastName: 'user',
      userName: 'fila'

    },
    recipient:  {
      id: '4fc55946-96d6-4306-883c-5480917bfad9',
      firstName: 'firstName',
      lastName: 'lastNmae',
      userName: 'fila'

    },
    status: MessageStatus.PENDING,
    type: MessageType.MESSAGE,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.CLOSED
    },
    creationDatetime: new Date()
  },

];

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private notificationsUrlPattern = `${environment.serverApiUrl}/notifications`;

  constructor(private httpClient: HttpClient) {
  }

  getMessages(userId: string): Observable<Message[]> {
    return of(userMessages);
    // return this.httpClient.get<Message[]>(this.notificationsUrlPattern);
  }
}
