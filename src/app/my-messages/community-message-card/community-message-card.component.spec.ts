import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CommunityMessageCardComponent } from './community-message-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityRegistrationService } from '../../shared/community-registration.service';
import { of } from 'rxjs';
import { CommunityUserRegistrationResponse } from '../../shared/community-user-registration-response';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Util } from '../../util/util';
import { NotificationType } from '../notification-type.enum';
import { CommunityRole } from '../../communities/community-role.enum';
import { NotificationCounterService } from '../../shared/notification-counter.service';
import { By } from '@angular/platform-browser';
import { CommunityUserRegistration } from '../../shared/community-user-registration';
import { MatDialog } from '@angular/material';

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

const userId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';

const expectedNotifications: any[] = [
  Util.createNotificationInstance({
    type: NotificationType.INVITATION_TO_JOIN_COMMUNITY,
    id: '76887802-f12f-47b0-bf8d-6d69fbcc77e5',
    creationDatetime: new Date(),
    communityName: 'Some closed community',
    registration: {
      id: 'b9f7a830-6437-4585-980c-b6820b6f03fb',
      user: {
        id: userId,
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
        id: userId,
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
        id: userId,
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
      id: userId,
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
  })
];


describe('CommunityMessageCardComponent', () => {
  let component: CommunityMessageCardComponent;
  let fixture: ComponentFixture<CommunityMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [CommunityMessageCardComponent, DeleteConfirmationDialogComponent],
      providers: [
        {
          provide: CommunityRegistrationService, useValue: jasmine.createSpyObj('communityRegistrationService', {
            'updateRegistration': of(registrationResponse)
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
    fixture = TestBed.createComponent(CommunityMessageCardComponent);
    component = fixture.componentInstance;
    component.currentUserId = userId;
    component.notification = expectedNotifications[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display accept/decline buttons for INVITATION_TO_JOIN_COMMUNITY notification in pending status', fakeAsync(() => {
    component.notification = expectedNotifications[0];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2);
    expect(buttons[0].nativeElement.textContent).toContain('done_outline');
    expect(buttons[1].nativeElement.textContent).toContain('cancel');
  }));

  it('should not display accept/decline buttons in case of REQUEST_TO_JOIN_COMMUNITY for user who sent the request', fakeAsync(() => {
    component.notification = expectedNotifications[1];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(0);
  }));

  it('should send an accept request on accept button click', fakeAsync(() => {
    component.notification = expectedNotifications[0];
    fixture.detectChanges();

    const acceptButton = fixture.debugElement.nativeElement.querySelector('button');

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
    component.notification = expectedNotifications[0];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));

    buttons[1].nativeElement.click();
    fixture.whenStable().then(() => {
      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
    });
  }));

  it('should show changed community fields', fakeAsync(() => {
    const expectedText = 'name, type, description, skills, links changed';
    component.notification = expectedNotifications[7];
    fixture.detectChanges();
    const notificationText = fixture.debugElement.query(By.css('.messages-notification-text'));

    expect(notificationText.nativeElement.innerText).toContain(expectedText);
  }));

  it('should display community information regarding to the notification type', fakeAsync(() => {
    for (const expectedNotification of expectedNotifications) {
      component.notification = expectedNotification;
      fixture.detectChanges();

      const communityDebugElement = fixture.debugElement.query(By.css(('.messages-community-information')));
      expect(communityDebugElement.nativeElement.innerHTML).toBe(expectedNotification.getCommunityInfo());
    }
  }));

  it('should display community name (without link) when community was deleted', fakeAsync(() => {
    const notificationsWithoutCommunity = Object.assign({}, expectedNotifications);
    notificationsWithoutCommunity[0].registration.community = null;
    notificationsWithoutCommunity[0].communityName = 'Name of deleted community';
    notificationsWithoutCommunity[1].registration.community = null;
    notificationsWithoutCommunity[1].communityName = 'Name of deleted community';
    notificationsWithoutCommunity[2].registration.community = null;
    notificationsWithoutCommunity[2].communityName = 'Name of deleted community';
    notificationsWithoutCommunity[4].community = null;
    notificationsWithoutCommunity[4].communityName = 'Name of deleted community';
    notificationsWithoutCommunity[5].community = null;
    notificationsWithoutCommunity[5].communityName = 'Name of deleted community';
    notificationsWithoutCommunity[7].community = null;
    notificationsWithoutCommunity[7].communityName = 'Name of deleted community';


    for (const expectedNotification of expectedNotifications) {
      component.notification = expectedNotification;
      fixture.detectChanges();

      const communityDebugElement = fixture.debugElement.query(By.css(('.messages-community-information')));
      expect(communityDebugElement.nativeElement.innerText).toBe(expectedNotification.getCommunityInfo());

      const linkToCommunity = communityDebugElement.query(By.css('a'));
      expect(linkToCommunity).toBeNull();
    }
  }));
});
