import { TestBed } from '@angular/core/testing';

import { CommunitiesService } from './communities.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CommunitiesService', () => {
  let httpTestingController: HttpTestingController;
  let service: CommunitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunitiesService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CommunitiesService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: CommunitiesService = TestBed.get(CommunitiesService);
    expect(service).toBeTruthy();
  });
});
