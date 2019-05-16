import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { MessagesService } from './messages.service';
import { MatDialog } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserIdentityService } from '../shared/user-identity.service';
import { switchMap } from 'rxjs/operators';
import { NotificationCounterService } from '../shared/notification-counter.service';

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

}
