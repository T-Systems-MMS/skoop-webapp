import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { ProjectRequiresApprovalNotification } from './project-requires-approval-notification';

@Component({
  selector: 'app-approve-project-message-card',
  templateUrl: './approve-project-message-card.component.html',
  styleUrls: ['./approve-project-message-card.component.scss']
})
export class ApproveProjectMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: ProjectRequiresApprovalNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

}
