import { async, TestBed } from '@angular/core/testing';

import { ExternalAssetsService } from './external-assets.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessagesService } from '../my-messages/messages.service';
import { StepDescription } from '../my-skills/step-description';

describe('ExternalAssetsService', () => {
  let httpTestingController: HttpTestingController;
  let templateLoaderService: ExternalAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagesService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    templateLoaderService = TestBed.get(ExternalAssetsService);
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
    templateLoaderService.getText(path).subscribe(html => {
      expect(html).toBe(htmlTemplate);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
    );

    expect(request.request.url).toEqual(path);
    expect(request.request.responseType).toEqual('text');

    request.flush(htmlTemplate);
  }));

  it('should send request to load json data', async(() => {
    const levelDescription: StepDescription = {
      step0: 'zero',
      step1: 'one',
      step2: 'two',
      step3: 'three',
      step4: 'four'
    };

    const path = '/some/path/to.json';
    templateLoaderService.getJSON<StepDescription>(path).subscribe(data => {
      expect(data).toBe(levelDescription);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
    );

    expect(request.request.url).toEqual(path);
    expect(request.request.responseType).toEqual('json');

    request.flush(levelDescription);
  }));
});
