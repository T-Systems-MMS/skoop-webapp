import { TestBed } from '@angular/core/testing';

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
});
