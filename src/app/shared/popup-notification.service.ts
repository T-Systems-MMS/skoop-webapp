import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { PopupNotificationClassName } from './popup-notification-class-name.enum';

@Injectable({
  providedIn: 'root'
})
export class PopupNotificationService {

  constructor(private snackBar: MatSnackBar) {
  }

  showSuccessMessage(message: string) {
    this.openSnackBar(message, PopupNotificationClassName.SUCCESS);
  }

  showWarningMessage(message: string) {
    this.openSnackBar(message, PopupNotificationClassName.WARNING);
  }

  showErrorMessage(message: string) {
    this.openSnackBar(message, PopupNotificationClassName.ERROR);
  }

  private openSnackBar(message: string, className: PopupNotificationClassName) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: [className],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
