import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

describe('GlobalErrorHandlerService', () => {

  let globalErrorHandlerService: GlobalErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandlerService]
    });

    globalErrorHandlerService = TestBed.get(GlobalErrorHandlerService);
  });

  it('should be created', () => {
    const service: GlobalErrorHandlerService = TestBed.get(GlobalErrorHandlerService);
    expect(service).toBeTruthy();
  });

  it('should take message text from ErrorEvent.message in case of client-side error', () => {
    const message = 'expected text';
    const errorEvent = new ErrorEvent('', {
      message: message
    });
    const err: HttpErrorResponse = new HttpErrorResponse({
      error: errorEvent
    });
    expect(globalErrorHandlerService.createFullMessage(err)).toBe(message);
  });

  it('should take message text from HttpErrorResponse.statusText in case of an error from other servers', () => {
    const statusText = 'status text';
    const errorJson = {
      message: 'json error text'
    };

    const err: HttpErrorResponse = new HttpErrorResponse({
      error: errorJson,
      statusText: statusText
    });
    expect(globalErrorHandlerService.createFullMessage(err)).toContain(statusText);
  });

  it('should build error message in case of server-side error', () => {
    const errorJson = {
      timestamp: new Date(),
      message: 'expected text',
      subErrors: [
        {
          field: 'some field',
          message: 'some message'
        }
      ]
    };

    const err: HttpErrorResponse = new HttpErrorResponse({
      error: errorJson
    });
    expect(globalErrorHandlerService.createFullMessage(err)).toBe('expected text\nError Details: some field some message ');
  });

});
