import { HttpErrorResponse } from '@angular/common/http';

export interface ResponseError {
    errorCode: number;
    message: string;
    // fullMessage is created inside GlobalErrorHandlerService. It's combination of message and subErrors.
    fullMessage: string;
    timestamp: Date;
    debugMessage: string;
    subErrors: ResponseSubError[];
}

export interface ResponseSubError {
    field: string;
    rejectedValue: any;
    message: string;
}
