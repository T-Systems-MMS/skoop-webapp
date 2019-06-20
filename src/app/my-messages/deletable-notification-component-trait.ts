import { EventEmitter, Output } from '@angular/core';
import { MessagesService } from './messages.service';
import { MatDialog } from '@angular/material/dialog';
import { AbstractNotification } from './abstract-notification';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

export abstract class DeletableNotificationComponentTrait {

  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();

  protected constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
  }

  delete<T extends AbstractNotification>(notification: T) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to delete the notification?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.delete(notification.id)
          .subscribe(() => {
            this.deleted.emit();
          }, errorResponse => {
            this.error.emit(errorResponse);
          });
      }
    });
  }

}
