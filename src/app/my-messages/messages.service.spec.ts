import { async, TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { NotificationType } from './notification-type.enum';

describe('MessagesService', () => {
  let httpTestingController: HttpTestingController;
  let messagesService: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagesService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    messagesService = TestBed.get(MessagesService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: MessagesService = TestBed.get(MessagesService);
    expect(service).toBeTruthy();
  });

  it('should provide list of notifications', async(() => {
    const userId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';
    const expectedNotifications: any[] = [
      {
        type: NotificationType.INVITATION_TO_JOIN_COMMUNITY,
        id: '76887802-f12f-47b0-bf8d-6d69fbcc77e5',
        creationDatetime: new Date(),
        registration: {
          id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
          user: {
            id: '251c2a3b-b737-4622-8060-196d5e297ebc',
            userName: 'testbed',
            firstName: 'Tabia',
            lastName: 'Testbed',
            email: 'tabia.testbed@skoop.io',
            coach: false,
          },
          approvedByUser: null,
          approvedByCommunity: true,
          community: {
            id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
            title: 'Some closed community',
            type: 'CLOSED',
            description: 'Some closed community description',
            links: [],
            managers: [],
            skills: []
          }
        }
      },
      {
        type: NotificationType.ACCEPTANCE_TO_COMMUNITY,
        id: '7019db9c-b658-4531-aa6c-d1e8e60b5ec3',
        creationDatetime: '2019-03-26T13:33:32.790655',
        registration: {
          id: '26fa54c0-163d-48e1-aab1-519f0ed7db13',
          user: {
            id: '251c2a3b-b737-4622-8060-196d5e297ebc',
            userName: 'testbed',
            firstName: 'Tabia',
            lastName: 'Testbed',
            email: 'tabia.testbed@skoop.io',
            coach: false,
          },
          approvedByUser: true,
          approvedByCommunity: true,
          community: {
            id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
            title: 'Some closed community',
            type: 'CLOSED',
            description: 'Some closed community description',
            links: [],
            managers: [],
            skills: []
          }
        }
      }
    ];

    messagesService.getUserNotifications(userId).subscribe((actualNotifications) => {
      expect(actualNotifications).toEqual(expectedNotifications);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/users/${userId}/notifications`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedNotifications);
  }));

  it('should send request to delete notification', async(() => {
    const notificationId = '7019db9c-b658-4531-aa6c-d1e8e60b5ec3';
    messagesService.delete(notificationId).subscribe(data => {
      expect(data).toBeNull();
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'DELETE'
      && req.url === `${environment.serverApiUrl}/notifications/${notificationId}`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(null);
  }));
});
