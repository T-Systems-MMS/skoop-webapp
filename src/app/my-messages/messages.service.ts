import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message } from './message';
import { CommunityType } from '../communities/community-type.enum';
import { MessageType } from './message-type.enum';

const response: Message[] = [
  {
    id: '567',
    creationDatetime: new Date(),
    type: MessageType.INVITATION,
    registration: {
      id: '123',
      approvedByUser: false,
      approvedByCommunity: true
    },
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
  },
  {
    id: '123',
    creationDatetime: new Date(),
    type: MessageType.COMMUNITY_ROLE_CHANGED,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
    attributes: {
      role: 'MANAGER'
    }
  },
  {
    id: '567',
    creationDatetime: new Date(),
    type: MessageType.INVITATION,
    registration: {
      id: '123',
      approvedByUser: null,
      approvedByCommunity: true
    },
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
  },
  {
    id: '890',
    creationDatetime: new Date(),
    type: MessageType.INVITATION,
    registration: {
      id: '123',
      approvedByUser: true,
      approvedByCommunity: true
    },
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
  }
];

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private messagesUrlPattern = `${environment.serverApiUrl}/messages`;

  constructor(private httpClient: HttpClient) {
  }

  getUserRegistrations(): Observable<Message[]> {
    return of(response);
    // return this.httpClient.get<CommunityUserRegistrationResponse[]>(this.messagesUrlPattern);
  }
}
