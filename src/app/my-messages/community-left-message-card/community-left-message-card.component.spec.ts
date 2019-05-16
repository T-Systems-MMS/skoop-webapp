import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityLeftMessageCardComponent } from './community-left-message-card.component';
import { NotificationType } from '../notification-type.enum';
import { MemberLeftCommunityNotification } from './member-left-community-notification';
import { CommunityType } from '../../communities/community-type.enum';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';

const notification: MemberLeftCommunityNotification = {
  type: NotificationType.MEMBER_LEFT_COMMUNITY,
  id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
  creationDatetime: new Date(),
  communityName: 'Some closed community',
  community: {
    id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
    title: 'Some closed community',
    type: CommunityType.CLOSED,
    description: 'Some closed community description',
    links: []
  },
  user: {
    id: '123456',
    userName: 'tester',
    firstName: 'Toni',
    lastName: 'Tester',
    email: 'toni.tester@skoop.io'
  },
};

describe('CommunityLeftMessageCardComponent', () => {
  let component: CommunityLeftMessageCardComponent;
  let fixture: ComponentFixture<CommunityLeftMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityLeftMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityLeftMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
