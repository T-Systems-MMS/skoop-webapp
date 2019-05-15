import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { MyMessagesComponent } from './my-messages.component';
import { of } from 'rxjs';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessagesService } from './messages.service';
import { Util } from '../util/util';
import { NotificationType } from './notification-type.enum';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';
import { CommunityRole } from '../communities/community-role.enum';
import { NotificationCounterService } from '../shared/notification-counter.service';
import { HttpErrorResponse } from '@angular/common/http';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

const expectedNotifications: any[] = [
  Util.createNotificationInstance({
    type: NotificationType.INVITATION_TO_JOIN_COMMUNITY,
    id: '76887802-f12f-47b0-bf8d-6d69fbcc77e5',
    creationDatetime: new Date(),
    communityName: 'Some closed community',
    registration: {
      id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
      user: {
        id: authenticatedUser.userId,
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.io',
        coach: false
      },
      approvedByUser: null,
      approvedByCommunity: true,
      community: {
        id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
        title: 'Some closed community',
        type: 'CLOSED',
        description: 'Some closed community description',
        links: [],
        managers: [],
        skills: []
      }
    }
  }),
  Util.createNotificationInstance({
    type: NotificationType.REQUEST_TO_JOIN_COMMUNITY,
    id: 'e84cacac-4fba-4cea-b7e6-7e3d9841b0a6',
    creationDatetime: new Date(),
    communityName: 'Some closed community',
    registration: {
      id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
      user: {
        id: authenticatedUser.userId,
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.io',
        coach: false
      },
      approvedByUser: true,
      approvedByCommunity: null,
      community: {
        id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
        title: 'Some closed community',
        type: 'CLOSED',
        description: 'Some closed community description',
        links: [],
        managers: [],
        skills: []
      }
    }
  }),
  Util.createNotificationInstance({
    type: NotificationType.ACCEPTANCE_TO_COMMUNITY,
    id: '7019db9c-b658-4531-aa6c-d1e8e60b5ec3',
    creationDatetime: '2019-03-26T13:33:32.790655',
    communityName: 'Some closed community',
    registration: {
      id: '26fa54c0-163d-48e1-aab1-519f0ed7db13',
      user: {
        id: authenticatedUser.userId,
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@skoop.io',
        coach: false
      },
      approvedByUser: true,
      approvedByCommunity: true,
      community: {
        id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
        title: 'Some closed community',
        type: 'CLOSED',
        description: 'Some closed community description',
        links: [],
        managers: [],
        skills: []
      }
    }
  }),
  Util.createNotificationInstance({
    type: NotificationType.COMMUNITY_DELETED,
    id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
    creationDatetime: new Date(),
    communityName: 'deleted community'
  }),
  Util.createNotificationInstance({
    type: NotificationType.MEMBER_LEFT_COMMUNITY,
    id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
    creationDatetime: new Date(),
    communityName: 'Some closed community',
    community: {
      id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
      title: 'Some closed community',
      type: 'CLOSED',
      description: 'Some closed community description',
      links: [],
      managers: [],
      skills: []
    },
    user: {
      id: authenticatedUser.userId,
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io',
      coach: false
    },
  }),
  Util.createNotificationInstance({
    type: NotificationType.MEMBER_KICKED_OUT_OF_COMMUNITY,
    id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
    creationDatetime: new Date(),
    communityName: 'Some closed community',
    community: {
      id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
      title: 'Some closed community',
      type: 'CLOSED',
      description: 'Some closed community description',
      links: [],
      managers: [],
      skills: []
    }
  }),
  Util.createNotificationInstance({
    type: NotificationType.COMMUNITY_ROLE_CHANGED,
    id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
    communityName: 'Super group',
    creationDatetime: new Date(),
    role: CommunityRole.MEMBER
  }),
  Util.createNotificationInstance({
    type: NotificationType.COMMUNITY_CHANGED,
    id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
    creationDatetime: new Date(),
    communityName: 'Some closed community',
    community: {
      id: '22c1ad17-4044-45a7-940c-22f1beeb7992',
      title: 'Some closed community',
      type: 'CLOSED',
      description: 'Some closed community description',
      links: [],
      managers: [],
      skills: []
    },
    communityDetails: ['NAME', 'TYPE', 'DESCRIPTION', 'SKILLS', 'LINKS']
  }),
  Util.createNotificationInstance({
    type: NotificationType.USER_WELCOME_NOTIFICATION,
    id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
    creationDatetime: new Date()
  })
];

@Component({
  selector: 'app-common-message-card',
  template: ''
})
class CommonMessageCardStubComponent {
  @Input() notification;
}

@Component({
  selector: 'app-community-message-card',
  template: '<ng-content select="[buttonContent]"></ng-content>'
})
class CommunityMessageCardStubComponent {
  @Input() notification;
  @Input() currentUserId;
  @Output() onSuccess: EventEmitter<void> = new EventEmitter();
  @Output() onErrorResponse: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-welcome-message-card',
  template: ''
})
class WelcomeMessageCardStubComponent {
  @Input() notification;
  @Output() onErrorResponse: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

describe('MyMessagesComponent', () => {
  let component: MyMessagesComponent;
  let fixture: ComponentFixture<MyMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [
        MyMessagesComponent,
        DeleteConfirmationDialogComponent,
        CommonMessageCardStubComponent,
        CommunityMessageCardStubComponent,
        WelcomeMessageCardStubComponent
      ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: MessagesService, useValue: jasmine.createSpyObj('messageService', {
            'getUserNotifications': of(expectedNotifications)
          })
        },
        {
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })
        },
        {
          provide: NotificationCounterService, useValue: jasmine.createSpyObj('NotificationCounterService', {
            'decrementCount': of()
          })
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [DeleteConfirmationDialogComponent]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the list of notifications', fakeAsync(() => {
    fixture.detectChanges();
    const notificationCards = fixture.debugElement.queryAll(By.css(('.messages-card')));

    expect(notificationCards.length).toBe(9);
  }));

  it('should throw an exception in case of deleting message of To-Do type', fakeAsync(() => {
    fixture.detectChanges();
    expect(function () {
      component.delete(expectedNotifications[0]);
    }).toThrow();
  }));

  it('should open confirmation dialog on delete button click', fakeAsync(() => {
    fixture.detectChanges();
    const notificationCards = fixture.debugElement.queryAll(By.css(('.messages-card')));
    const buttons = notificationCards[3].query(By.css('button'));

    buttons.nativeElement.click();
    fixture.whenStable().then(() => {
      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
    });
  }));

});
