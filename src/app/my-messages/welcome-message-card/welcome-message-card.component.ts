import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserWelcomeNotification } from '../user-welcome-notification';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';
import { TemplateLoaderService } from '../../shared/template-loader.service';
import { MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-welcome-message-card',
  templateUrl: './welcome-message-card.component.html',
  styleUrls: ['./welcome-message-card.component.scss']
})
export class WelcomeMessageCardComponent implements OnInit {

  @Input() notification: UserWelcomeNotification;
  @Output() onErrorResponse: EventEmitter<HttpErrorResponse> = new EventEmitter();

  constructor(private templateLoader: TemplateLoaderService,
              public dialog: MatDialog) { }

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
        this.onErrorResponse.emit(errorResponse);
      });
  }

}
