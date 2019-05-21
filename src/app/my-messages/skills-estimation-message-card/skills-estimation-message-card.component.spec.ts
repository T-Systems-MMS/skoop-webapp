import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsEstimationMessageCardComponent } from './skills-estimation-message-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';
import { NotificationType } from '../notification-type.enum';
import { SkillsEstimationNotification } from './skills-estimation-notification';

const notification: SkillsEstimationNotification = {
  type: NotificationType.SKILLS_ESTIMATION_NOTIFICATION,
  id: '888f8c9e-4655-47f7-8cf0-b6021b254acc',
  creationDatetime: new Date(),
  skills: [
    {
      id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
      name: 'Java'
    },
    {
      id: '44c1ad17-4044-45a7-940c-22f1beeb7123',
      name: 'JavaScript'
    }
  ]
};

describe('SkillsEstimationMessageCardComponent', () => {
  let component: SkillsEstimationMessageCardComponent;
  let fixture: ComponentFixture<SkillsEstimationMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ SkillsEstimationMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsEstimationMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
