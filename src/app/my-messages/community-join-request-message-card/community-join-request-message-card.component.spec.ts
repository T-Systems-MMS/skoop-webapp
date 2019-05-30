import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CommunityJoinRequestMessageCardComponent } from './community-join-request-message-card.component';
import { TodoNotification } from '../todo-notification';
import { NotificationType } from '../notification-type.enum';
import { CommunityType } from '../../communities/community-type.enum';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { CommunityUserRegistration } from '../../shared/community-user-registration';
import { MatDialog } from '@angular/material';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CommunityUserRegistrationResponse } from '../../shared/community-user-registration-response';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const registrationResponse: CommunityUserRegistrationResponse = {
  id: '567890',
  user: {
    id: '251c2a3b-b737-4622-8060-196d5e297ebc',
    userName: 'testbed',
    firstName: 'Tabia',
    lastName: 'Testbed',
    email: 'tabia.testbed@skoop.io'
  },
  approvedByUser: true,
  approvedByCommunity: true
};

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
    approvedByUser: true,
    approvedByCommunity: null,
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
      declarations: [ CommunityJoinRequestMessageCardComponent, MessageCardComponent, DeleteConfirmationDialogComponent ],
      providers: [
        {
          provide: CommunityRegistrationService, useValue: jasmine.createSpyObj('communityRegistrationService', {
            'updateRegistration': of(registrationResponse)
          })
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ DeleteConfirmationDialogComponent ]
        }
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

  it('should send an accept request on accept button click', fakeAsync(() => {
    component.onAccept();
    fixture.whenStable().then(() => {
      const expectedRequestData: CommunityUserRegistration = {
        id: notification.registration.id,
        approvedByUser: null,
        approvedByCommunity: true
      };
      const registrationService: CommunityRegistrationService = TestBed.get(CommunityRegistrationService);
      expect(registrationService.updateRegistration)
        .toHaveBeenCalledWith(notification.registration.community.id, expectedRequestData);
    });
  }));

  it('should open confirmation dialog on decline button click', fakeAsync(() => {
    component.onDecline();
    fixture.whenStable().then(() => {
      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
    });
  }));

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
