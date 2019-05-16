import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRoleChangedMessageCardComponent } from './community-role-changed-message-card.component';
import { CommunityRoleChangedNotification } from './community-role-changed-notification';
import { NotificationType } from '../notification-type.enum';
import { CommunityRole } from '../../communities/community-role.enum';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';

const notification: CommunityRoleChangedNotification =  {
  type: NotificationType.COMMUNITY_ROLE_CHANGED,
  id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
  communityName: 'Super group',
  creationDatetime: new Date(),
  role: CommunityRole.MEMBER
};

describe('CommunityRoleChangedMessageCardComponent', () => {
  let component: CommunityRoleChangedMessageCardComponent;
  let fixture: ComponentFixture<CommunityRoleChangedMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityRoleChangedMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRoleChangedMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
