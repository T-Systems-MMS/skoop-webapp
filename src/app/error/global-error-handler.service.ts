import { Injectable} from '@angular/core';
import { ResponseError, ResponseSubError } from './response-error';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * It creates the fullMessage that we finally show to clients.
 * If in server an error occures, It will always return a ResponseError object; Beacuase ResponseError object has more
 * information besides the message, we have created this class as a util to create the fullMessage.
 * Developrs can either use this class or manage their own for handling HttpErrorResponse.
 */
@Injectable()
export class GlobalErrorHandlerService {

    createFullMessage(errorResponse: HttpErrorResponse): string {
        if (errorResponse.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            console.error(`Error creating new user skill: ${errorResponse.error.message}`);
            return errorResponse.error.message;
        } else {
            // A server-side error occurred.
            let serverDetailsError: ResponseError;
            if (typeof errorResponse.error === 'string' && this.instanceOfResponseError(JSON.parse(errorResponse.error))) {
                console.log('for text!');
                serverDetailsError = JSON.parse(errorResponse.error);
            } else if (typeof errorResponse.error === 'object' && (!this.instanceOfResponseError(errorResponse.error))) {
                // This means we get an error from other servers, except Myskill-Server, like Keycloak-Server ...
                return errorResponse.message;
            } else {
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

    instanceOfResponseError(object: any): object is ResponseError {
        return 'errorCode' in object || 'timestamp' in object;
        // return object.discriminator === 'I-AM-A';
    }

}
