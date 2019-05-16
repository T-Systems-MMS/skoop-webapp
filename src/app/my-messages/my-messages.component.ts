import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessagesService } from './messages.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { AbstractNotification } from './abstract-notification';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserIdentityService } from '../shared/user-identity.service';
import { switchMap } from 'rxjs/operators';
import { NotificationCounterService } from '../shared/notification-counter.service';
import { AbstractCommunityNotification } from './abstract-community-notification';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss']
})
export class MyMessagesComponent implements OnInit {

  errorMessage: string = null;
  currentUserId: string;
  notifications$ = of([]);

  constructor(private messageService: MessagesService,
              private userIdentityService: UserIdentityService,
              private notificationCounterService: NotificationCounterService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.loadMessages();
  }

  isCommunityNotification<T extends AbstractNotification>(notification: T): boolean {
    return (notification instanceof AbstractCommunityNotification);
  }

  showDeleteButton<T extends AbstractNotification>(notification: T): boolean {
    return !this.isToDoType(notification);
  }

  delete<T extends AbstractNotification>(notification: T) {
    if (this.isToDoType(notification)) {
      throw new Error('Invalid type of notification to delete');
    }

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
            this.loadMessages();
            this.notificationCounterService.decrementCount();
          }, errorResponse => {
            this.handleErrorResponse(errorResponse);
          });
      }
    });
  }

  private loadMessages() {
    this.notifications$ = this.userIdentityService.getUserIdentity()
      .pipe(switchMap(userIdentity => {
        this.currentUserId = userIdentity.userId;
        return this.messageService.getUserNotifications(this.currentUserId);
      }));
  }

  public handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  public onSuccessDeleted() {
    this.loadMessages();
    this.notificationCounterService.decrementCount();
  }

  private isToDoType<T extends AbstractNotification>(notification: T): boolean {
    return this.isCommunityNotification(notification) && (notification.hasCommunityInvitationType() || notification.hasJoinCommunityType());
  }

}
