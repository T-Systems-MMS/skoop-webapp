import { async, TestBed } from '@angular/core/testing';

import { TemplateLoaderService } from './template-loader.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessagesService } from '../my-messages/messages.service';

describe('TemplateLoaderService', () => {
  let httpTestingController: HttpTestingController;
  let templateLoaderService: TemplateLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagesService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    templateLoaderService = TestBed.get(TemplateLoaderService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(templateLoaderService).toBeTruthy();
  });

  it('should send request to load html template', async(() => {
    const htmlTemplate = '<div>Some text</div>';
    const path = '/some/path/to.html';
    templateLoaderService.loadTemplate(path).subscribe(html => {
      expect(html).toBe(htmlTemplate);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
    );

    expect(request.request.url).toEqual(path);
    expect(request.request.responseType).toEqual('text');

    request.flush(htmlTemplate);
  }));
});
