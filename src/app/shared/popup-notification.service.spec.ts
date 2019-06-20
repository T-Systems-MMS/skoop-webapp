import { TestBed } from '@angular/core/testing';

import { PopupNotificationService } from './popup-notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

const expectedSettings = {
  duration: 5000,
  panelClass: [],
  verticalPosition: 'top',
  horizontalPosition: 'right'
};

describe('PopupNotificationService', () => {
  let popupNotificationService: PopupNotificationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PopupNotificationService,
        {
          provide: MatSnackBar,
          useValue: jasmine.createSpyObj('snackBar', {'open': of<void>()})
        }
      ]
    });

    popupNotificationService = TestBed.get(PopupNotificationService);
  });

  afterEach(() => {
    expectedSettings.panelClass = [];
  });

  it('should be created', () => {
    expect(popupNotificationService).toBeTruthy();
  });

  it('should call snackBar.open with settings for success notification', () => {
    const message = 'success message';
    expectedSettings.panelClass = ['success-notification'];
    popupNotificationService.showSuccessMessage(message);
    const snackBar = TestBed.get(MatSnackBar);
    expect(snackBar.open).toHaveBeenCalledWith(message, '', expectedSettings);
  });

  it('should call snackBar.open with settings for warning notification', () => {
    const message = 'warning message';
    expectedSettings.panelClass = ['warning-notification'];
    popupNotificationService.showWarningMessage(message);
    const snackBar = TestBed.get(MatSnackBar);
    expect(snackBar.open).toHaveBeenCalledWith(message, '', expectedSettings);
  });

  it('should call snackBar.open with settings for error notification', () => {
    const message = 'error message';
    expectedSettings.panelClass = ['error-notification'];
    popupNotificationService.showErrorMessage(message);
    const snackBar = TestBed.get(MatSnackBar);
    expect(snackBar.open).toHaveBeenCalledWith(message, '', expectedSettings);
  });
});
