import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAcceptanceMessageCardComponent } from './community-acceptance-message-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';
import { NotificationType } from '../notification-type.enum';
import { AcceptanceToCommunityNotification } from './acceptance-to-community-notification';
import { CommunityType } from '../../communities/community-type.enum';
import { By } from '@angular/platform-browser';

const notification: AcceptanceToCommunityNotification = {
  type: NotificationType.ACCEPTANCE_TO_COMMUNITY,
  id: '7019db9c-b658-4531-aa6c-d1e8e60b5ec3',
  creationDatetime: new Date(),
  communityName: 'Some closed community',
  registration: {
    id: '26fa54c0-163d-48e1-aab1-519f0ed7db13',
    user: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io'
    },
    approvedByUser: true,
    approvedByCommunity: true,
    community: {
      id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
      title: 'Some closed community',
      type: CommunityType.CLOSED,
      description: 'Some closed community description',
      links: []
    }
  }
};

describe('CommunityAcceptanceMessageCardComponent', () => {
  let component: CommunityAcceptanceMessageCardComponent;
  let fixture: ComponentFixture<CommunityAcceptanceMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityAcceptanceMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAcceptanceMessageCardComponent);
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
    expect(linkElem.properties.href).toBe(`/communities/${notification.registration.community.id}`);
  });

  it('should not contain community link when community is not defined', () => {
    component.notification.registration.community = null;
    fixture.detectChanges();
    const messageElem = fixture.debugElement.query(By.css('.messages-message-text'));
    const linkElem = messageElem.query(By.css('a'));
    expect(linkElem).toBeNull();
  });

});
