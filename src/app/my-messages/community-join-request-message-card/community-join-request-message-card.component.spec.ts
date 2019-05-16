import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJoinRequestMessageCardComponent } from './community-join-request-message-card.component';
import { TodoNotification } from '../todo-notification/todo-notification';
import { NotificationType } from '../notification-type.enum';
import { CommunityType } from '../../communities/community-type.enum';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { CommunityRegistrationService } from '../../shared/community-registration.service';

const currentUserId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';
const notification: TodoNotification = {
  type: NotificationType.REQUEST_TO_JOIN_COMMUNITY,
  id: currentUserId,
  creationDatetime: new Date(),
  communityName: 'Some closed community',
  registration: {
    id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
    user: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io'
    },
    approvedByUser: null,
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

describe('CommunityJoinRequestMessageCardComponent', () => {
  let component: CommunityJoinRequestMessageCardComponent;
  let fixture: ComponentFixture<CommunityJoinRequestMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityJoinRequestMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: CommunityRegistrationService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityJoinRequestMessageCardComponent);
    component = fixture.componentInstance;
    component.currentUserId = currentUserId;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
