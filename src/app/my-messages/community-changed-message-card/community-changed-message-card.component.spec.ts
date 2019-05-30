import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityChangedMessageCardComponent } from './community-changed-message-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';
import { NotificationType } from '../notification-type.enum';
import { CommunityChangedNotification } from './community-changed-notification';
import { CommunityType } from '../../communities/community-type.enum';
import { CommunityDetails } from './community-details.enum';
import { By } from '@angular/platform-browser';

const notification: CommunityChangedNotification = {
  type: NotificationType.COMMUNITY_CHANGED,
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
  communityDetails: [CommunityDetails.NAME, CommunityDetails.TYPE, CommunityDetails.DESCRIPTION, CommunityDetails.SKILLS, CommunityDetails.LINKS]
};

describe('CommunityChangedMessageCardComponent', () => {
  let component: CommunityChangedMessageCardComponent;
  let fixture: ComponentFixture<CommunityChangedMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityChangedMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityChangedMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain community link when community is defined', () => {
    const messageElem = fixture.debugElement.query(By.css('.messages-message-text'));
    const linkElem = messageElem.query(By.css('a'));
    expect(linkElem).toBeDefined();
    expect(linkElem.properties.href).toBe(`/communities/${notification.community.id}`);
  });

  it('should not contain community link when community is not defined', () => {
    component.notification.community = null;
    fixture.detectChanges();
    const messageElem = fixture.debugElement.query(By.css('.messages-message-text'));
    const linkElem = messageElem.query(By.css('a'));
    expect(linkElem).toBeNull();
  });
});
