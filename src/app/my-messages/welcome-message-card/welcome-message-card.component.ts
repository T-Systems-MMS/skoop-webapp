import { Component, Input, OnInit } from '@angular/core';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';
import { ExternalAssetsService } from '../../shared/external-assets.service';
import { MatDialog } from '@angular/material/dialog';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { UserWelcomeNotification } from './user-welcome-notification';

@Component({
  selector: 'app-welcome-message-card',
  templateUrl: './welcome-message-card.component.html',
  styleUrls: ['./welcome-message-card.component.scss']
})
export class WelcomeMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: UserWelcomeNotification;

  constructor(private templateLoader: ExternalAssetsService,
              protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  openWelcomeNotificationDialog() {
    this.templateLoader.getText('/assets/templates/welcome-notification.html')
      .subscribe(html => {
        this.dialog.open(InfoDialogComponent, {
          width: '550px',
          data: {
            message: html
          }
        });
      }, errorResponse => {
        this.error.emit(errorResponse);
      });
  }

}
