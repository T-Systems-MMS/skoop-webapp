import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMessagesComponent } from './my-messages.component';
import { UserIdentity } from '../shared/user-identity';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { MessageService } from './message.service';
import { Message } from './message';
import { MessageStatus } from './message-status.enum';
import { MessageType } from './message-type.enum';
import { CommunityType } from '../communities/community-type.enum';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@myskills.io',
  roles: ['ROLE_USER']
};

const userMessages: Message[] = [
  {
    id: '1',
    initiator: {
      id: '1',
      firstName: 'some',
      lastName: 'user',
      userName: 'fila'

    },
    recipient:  {
      id: '4fc55946-96d6-4306-883c-5480917bfad9',
      firstName: 'firstName',
      lastName: 'lastNmae',
      userName: 'fila'

    },
    status: MessageStatus.PENDING,
    type: MessageType.COMMUNITY_JOIN_REQUEST,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.CLOSED
    },
    creationDatetime: new Date()
  },
  {
    id: '12',
    initiator: {
      id: '1',
      firstName: 'some',
      lastName: 'user',
      userName: 'fila'

    },
    recipient:  {
      id: '4fc55946-96d6-4306-883c-5480917bfad9',
      firstName: 'firstName',
      lastName: 'lastNmae',
      userName: 'fila'

    },
    status: MessageStatus.ACCEPTED,
    type: MessageType.COMMUNITY_JOIN_REQUEST,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.CLOSED
    },
    creationDatetime: new Date()
  },
  {
    id: '1',
    initiator: {
      id: '1',
      firstName: 'some',
      lastName: 'user',
      userName: 'fila'

    },
    recipient:  {
      id: '4fc55946-96d6-4306-883c-5480917bfad9',
      firstName: 'firstName',
      lastName: 'lastNmae',
      userName: 'fila'

    },
    status: MessageStatus.PENDING,
    type: MessageType.MESSAGE,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.CLOSED
    },
    creationDatetime: new Date()
  },

];

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
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })
        },
        {
          provide: MessageService, useValue: jasmine.createSpyObj('messageService', {
            'getMessages': of(userMessages)
          })
        },
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
