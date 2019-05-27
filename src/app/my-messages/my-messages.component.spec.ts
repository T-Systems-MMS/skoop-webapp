import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { MyMessagesComponent } from './my-messages.component';
import { of } from 'rxjs';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessagesService } from './messages.service';
import { NotificationType } from './notification-type.enum';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';
import { CommunityRole } from '../communities/community-role.enum';
import { NotificationCounterService } from '../shared/notification-counter.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

const expectedNotifications: any[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
    type: NotificationType.COMMUNITY_DELETED,
    id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
    creationDatetime: new Date(),
    communityName: 'deleted community'
  },
  {
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
  },
  {
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
  },
  {
    type: NotificationType.COMMUNITY_ROLE_CHANGED,
    id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
    communityName: 'Super group',
    creationDatetime: new Date(),
    role: CommunityRole.MEMBER
  },
  {
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
  },
  {
    type: NotificationType.USER_WELCOME_NOTIFICATION,
    id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
    creationDatetime: new Date()
  },
  {
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
  },
  {
    type: NotificationType.PROJECT_NEEDS_APPROVAL,
    id: '888f8c9e-4655-47f7-8cf0-b6021b254acc',
    creationDatetime: new Date(),
    userProjects: [
      {
        id: 1,
        role: 'developer',
        tasks: 'development',
        startDate: moment(),
        endDate: moment(),
        creationDate: moment(),
        lastModifiedDate: moment(),
        user: {
          id: '123',
          userName: 'username',
          firstName: 'John',
          lastName: 'Smith'
        },
        project: {
          id: '456',
          name: 'Project',
          creationDate: new Date(),
          customer: 'Customer',
          description: null,
          industrySector: 'Software development',
          lastModifiedDate: new Date()
        },
        skills: [],
        approved: false
      }
    ]
  }
];

@Component({
  selector: 'app-community-acceptance-message-card',
  template: ''
})
class CommunityAcceptanceMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-changed-message-card',
  template: ''
})
class CommunityChangedMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-deleted-message-card',
  template: ''
})
class CommunityDeletedMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-invitation-message-card',
  template: ''
})
class CommunityInvitationMessageCardStubComponent {
  @Input() notification;
  @Input() currentUserId;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-join-request-message-card',
  template: ''
})
class CommunityJoinRequestMessageCardStubComponent {
  @Input() notification;
  @Input() currentUserId;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-kick-out-message-card',
  template: ''
})
class CommunityKickOutMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-left-message-card',
  template: ''
})
class CommunityLeftMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-community-role-changed-message-card',
  template: ''
})
class CommunityRoleChangedMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-welcome-message-card',
  template: ''
})
class WelcomeMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-skills-estimation-message-card',
  template: ''
})
class SkillsEstimationMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
}

@Component({
  selector: 'app-approve-project-message-card',
  template: ''
})
class ApproveProjectMessageCardStubComponent {
  @Input() notification;
  @Output() deleted: EventEmitter<HttpErrorResponse> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();
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
        CommunityAcceptanceMessageCardStubComponent,
        CommunityChangedMessageCardStubComponent,
        CommunityDeletedMessageCardStubComponent,
        CommunityInvitationMessageCardStubComponent,
        CommunityJoinRequestMessageCardStubComponent,
        CommunityKickOutMessageCardStubComponent,
        CommunityLeftMessageCardStubComponent,
        CommunityRoleChangedMessageCardStubComponent,
        WelcomeMessageCardStubComponent,
        SkillsEstimationMessageCardStubComponent,
        ApproveProjectMessageCardStubComponent
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
          provide: NotificationCounterService, useValue: jasmine.createSpyObj('notificationCounterService', {
            'decrementCount': of()
          })
        }
      ]
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
    const notificationCards = fixture.debugElement.queryAll(By.css(('.message-card')));

    expect(notificationCards.length).toBe(11);
  }));

  it('should reload notifications and decrement count after deletion a notification', fakeAsync(() => {
    const welcomeMessageFixture = fixture.debugElement.query(By.directive(WelcomeMessageCardStubComponent));
    const welcomeMessageComponent: WelcomeMessageCardStubComponent = welcomeMessageFixture.componentInstance;
    welcomeMessageComponent.deleted.emit();

    const messageService: MessagesService = TestBed.get(MessagesService);
    expect(messageService.getUserNotifications).toHaveBeenCalled();
    const notificationCounterService: NotificationCounterService = TestBed.get(NotificationCounterService);
    expect(notificationCounterService.decrementCount).toHaveBeenCalled();
  }));

  it('should show error on error in a child component', fakeAsync(() => {
    const welcomeMessageFixture = fixture.debugElement.query(By.directive(WelcomeMessageCardStubComponent));
    const welcomeMessageComponent: WelcomeMessageCardStubComponent = welcomeMessageFixture.componentInstance;
    const message = 'expected text';
    const errorEvent = new ErrorEvent('', {
      message: message
    });
    const err: HttpErrorResponse = new HttpErrorResponse({
      error: errorEvent
    });
    welcomeMessageComponent.error.emit(err);


    expect(component.errorMessage).toBe(message);
  }));

});
