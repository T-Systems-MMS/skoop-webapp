import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class PopupNotificationService {

  constructor(private snackBar: MatSnackBar) {
  }

  showSuccessMessage(message: string) {
    this.openSnackBar(message, 'success-notification');
  }

  showWarningMessage(message: string) {
    this.openSnackBar(message, 'warning-notification');
  }

  showErrorMessage(message: string) {
    this.openSnackBar(message, 'error-notification');
  }

  private openSnackBar(message: string, className: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: [className],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
