import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { throwError } from 'rxjs';
import { ResponseError, ResponseSubError } from './response-error';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * It creates the fullMessage that we finally show to clients.
 * If in server an error occures, It will always return a ResponseError object; Beacuase ResponseError object has more
 * information besides the message, we have created this class as a util to create the fullMessage.
 * Developrs can either use this class or  createFullMessage of this class or create their own message.
 */
@Injectable()
export class GlobalErrorHandlerService {

    createFullMessage(errorResponse: HttpErrorResponse): string {
        console.log('-> ' + errorResponse);
        if (errorResponse.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            console.error(`Error creating new user skill: ${errorResponse.error.message}`);
            return errorResponse.error.message;
        } else {
            // A server-side error occurred.
            let serverDetailsError: ResponseError;
            if (typeof errorResponse.error === 'string') {
                console.log('B1');
                serverDetailsError = JSON.parse(errorResponse.error);
            } else if (typeof errorResponse.error === 'undefined') {
                console.log('B2');
                console.log('inside undefined error section : ' + errorResponse.message);
                console.log('error: ' + errorResponse.error);
                return errorResponse.message;
            } else  {
                console.log('B3');
                serverDetailsError = errorResponse.error;
            }

            let fullMessage: string = '(#' + serverDetailsError.errorCode + ') - ' + serverDetailsError.message;

            const responseSubErrors: ResponseSubError[] = serverDetailsError.subErrors;
            if (responseSubErrors) {
                let exceptionDescription = 'Error Details: ';
                responseSubErrors.forEach(subError =>
                    exceptionDescription = exceptionDescription + subError.field + ' ' + subError.message + ' '
                );
                fullMessage += '\n' + exceptionDescription;
            }
            return fullMessage;
        }
    }

}
