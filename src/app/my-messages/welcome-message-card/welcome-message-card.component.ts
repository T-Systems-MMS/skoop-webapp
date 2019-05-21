import { Component, Input, OnInit } from '@angular/core';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';
import { TemplateLoaderService } from '../../shared/template-loader.service';
import { MatDialog } from '@angular/material';
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

  constructor(private templateLoader: TemplateLoaderService,
              protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  openWelcomeNotificationDialog() {
    this.templateLoader.loadTemplate('/assets/templates/welcome-notification.html')
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
