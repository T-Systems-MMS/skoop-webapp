import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMessagesComponent } from './my-messages.component';
import { of } from 'rxjs';
import { CommunityType } from '../communities/community-type.enum';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { Message } from './message';
import { MessageType } from './message-type.enum';
import { MessagesService } from './messages.service';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';

const response: Message[] = [
  {
    id: '567',
    creationDatetime: new Date(),
    type: MessageType.INVITATION,
    registration: {
      id: '123',
      approvedByUser: false,
      approvedByCommunity: true
    },
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
  },
  {
    id: '123',
    creationDatetime: new Date(),
    type: MessageType.COMMUNITY_ROLE_CHANGED,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
    attributes: {
      role: 'MANAGER'
    }
  },
  {
    id: '567',
    creationDatetime: new Date(),
    type: MessageType.INVITATION,
    registration: {
      id: '123',
      approvedByUser: null,
      approvedByCommunity: true
    },
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
  },
  {
    id: '890',
    creationDatetime: new Date(),
    type: MessageType.INVITATION,
    registration: {
      id: '123',
      approvedByUser: true,
      approvedByCommunity: true
    },
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
  }
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
  approvedByUser: false,
  approvedByCommunity: true
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
      declarations: [ MyMessagesComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpyObj('messageService', {
            'getUserRegistrations': of(response)
          })
        },
        {
          provide: CommunityRegistrationService, useValue: jasmine.createSpyObj('communityRegistrationService', {
            'updateRegistration': of(registrationResponse)
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
});
