import { Component, Input, OnInit } from '@angular/core';
import { DeletableNotificationComponentTrait } from '../deletable-notification-component-trait';
import { MessagesService } from '../messages.service';
import { MatDialog } from '@angular/material';
import { SkillsEstimationNotification } from './skills-estimation-notification';

@Component({
  selector: 'app-skills-estimation-message-card',
  templateUrl: './skills-estimation-message-card.component.html',
  styleUrls: ['./skills-estimation-message-card.component.scss']
})
export class SkillsEstimationMessageCardComponent extends DeletableNotificationComponentTrait implements OnInit {

  @Input() notification: SkillsEstimationNotification;

  constructor(protected messageService: MessagesService,
              public dialog: MatDialog) {
    super(messageService, dialog);
  }

  ngOnInit() {
  }

  buildSkillsText(): string {
    return this.notification.skills.map(item => `<strong>${item.name}</strong>`).join(', ');
  }

}
