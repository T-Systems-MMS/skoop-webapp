import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommunitiesService } from '../communities/communities.service';

describe('MessageService', () => {
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    messageService = TestBed.get(CommunitiesService);
  });

  it('should be created', () => {
    const service: MessageService = TestBed.get(MessageService);
    expect(service).toBeTruthy();
  });
});
