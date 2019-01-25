import { TestBed } from '@angular/core/testing';

import { DownloadService } from './download.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('DownloadService', () => {

  let httpTestingController: HttpTestingController;
  let service: DownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(DownloadService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user profile document as blob', () => {

    service.downloadAnonymousUserProfile('5acc24df-792a-4458-8d01-0c67033eceff').subscribe((data: Blob) => {
      expect(data).toEqual(new Blob(['some data']));
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/download/users/5acc24df-792a-4458-8d01-0c67033eceff`
    });

    expect(request.request.responseType).toEqual('blob');
    request.flush(new Blob(['some data']));
  });

});
