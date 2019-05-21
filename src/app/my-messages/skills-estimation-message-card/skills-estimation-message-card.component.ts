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
    return `You need to estimate the ${this.notification.skills.length > 1 ? 'skills': 'skill'} `
      + this.notification.skills.map(item => `<strong>${item.name}</strong>`).join(', ')
      + '. You can do this on <a href="/my-skills">My skill profile</a> page';
  }

}
