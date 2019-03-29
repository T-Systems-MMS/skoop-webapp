import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { MyMessagesComponent } from './my-messages.component';
import { of } from 'rxjs';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { MessagesService } from './messages.service';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { Util } from '../util/util';
import { NotificationType } from './notification-type.enum';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { By } from '@angular/platform-browser';
import { CommunityUserRegistration } from '../shared/community-user-registration';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@myskills.io',
  roles: ['ROLE_USER']
};

const expectedNotifications: any[] = [
  Util.createNotificationInstance({
    type: NotificationType.INVITATION_TO_JOIN_COMMUNITY,
    id: '76887802-f12f-47b0-bf8d-6d69fbcc77e5',
    creationDatetime: new Date(),
    registration: {
      id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
      user: {
        id: authenticatedUser.userId,
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@myskills.io',
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
    registration: {
      id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
      user: {
        id: authenticatedUser.userId,
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@myskills.io',
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
    type: NotificationType.ACCEPTANCE_TO_COMMUNITY,
    id: '7019db9c-b658-4531-aa6c-d1e8e60b5ec3',
    creationDatetime: '2019-03-26T13:33:32.790655',
    registration: {
      id: '26fa54c0-163d-48e1-aab1-519f0ed7db13',
      user: {
        id: authenticatedUser.userId,
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester',
        email: 'toni.tester@myskills.io',
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
  })
];

const registrationResponse: CommunityUserRegistrationResponse = {
  id: '567890',
  user: {
    id: '251c2a3b-b737-4622-8060-196d5e297ebc',
    userName: 'testbed',
    firstName: 'Tabia',
    lastName: 'Testbed',
    email: 'tabia.testbed@myskills.io',
    coach: false,
  },
  approvedByUser: true,
  approvedByCommunity: true
};

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
      declarations: [ MyMessagesComponent, DeleteConfirmationDialogComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: MessagesService, useValue: jasmine.createSpyObj('messageService', {
            'getUserNotifications': of(expectedNotifications)
          })
        },
        {
          provide: CommunityRegistrationService, useValue: jasmine.createSpyObj('communityRegistrationService', {
            'updateRegistration': of(registrationResponse)
          })
        },
        {
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
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

    expect(notificationCards.length).toBe(3);
  }));

  it('should display accept/decline buttons for INVITATION_TO_JOIN_COMMUNITY notification in pending status', fakeAsync(() => {
    fixture.detectChanges();
    const notificationCards = fixture.debugElement.queryAll(By.css(('.messages-card')));

    const buttons = notificationCards[0].queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('done_outline');
    expect(buttons[1].nativeElement.textContent).toContain('cancel');
  }));

  it('should not display accept/decline buttons in case of REQUEST_TO_JOIN_COMMUNITY for user who sent the request', fakeAsync(() => {
    fixture.detectChanges();
    const notificationCards = fixture.debugElement.queryAll(By.css(('.messages-card')));

    const buttons = notificationCards[1].queryAll(By.css('button'));
    expect(buttons.length).toBe(0);
  }));

  it('should send an accept request on accept button click', fakeAsync(() => {
    fixture.detectChanges();
    const notificationCards = fixture.debugElement.queryAll(By.css(('.messages-card')));
    const acceptButton = notificationCards[0].nativeElement.querySelector('button');

    acceptButton.click();
    fixture.whenStable().then(() => {
      const expectedRequestData: CommunityUserRegistration = {
        id: expectedNotifications[0].registration.id,
        approvedByUser: true,
        approvedByCommunity: null
      };
      const registrationService: CommunityRegistrationService = TestBed.get(CommunityRegistrationService);
      expect(registrationService.updateRegistration)
        .toHaveBeenCalledWith(expectedNotifications[0].registration.community.id, expectedRequestData);
    });
  }));

  it('should open confirmation dialog on decline button click', fakeAsync(() => {
    fixture.detectChanges();
    const notificationCards = fixture.debugElement.queryAll(By.css(('.messages-card')));
    const buttons = notificationCards[0].queryAll(By.css('button'));

    buttons[1].nativeElement.click();
    fixture.whenStable().then(() => {
      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
    });
  }));
});
