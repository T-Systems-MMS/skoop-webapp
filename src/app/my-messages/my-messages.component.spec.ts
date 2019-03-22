import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMessagesComponent } from './my-messages.component';
import { of } from 'rxjs';
import { MessageStatus } from './message-status.enum';
import { CommunityType } from '../communities/community-type.enum';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { CommunityRegistrationService } from '../shared/community-registration.service';

const response: CommunityUserRegistrationResponse[] = [
  {
    id: '12345',
    user: {
      id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
      userName: 'testing',
      firstName: 'Tina',
      lastName: 'Testing',
      email: 'tina.testing@myskills.io',
      coach: false,
    },
    approvedByUser: false,
    approvedByCommunity: true,
    status: MessageStatus.PENDING,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN,
    },
    creationDatetime: new Date()
  },
  {
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
    approvedByCommunity: true,
    status: MessageStatus.PENDING,
    community: {
      id: '1',
      title: 'community',
      description: '',
      links: [],
      type: CommunityType.OPEN
    },
    creationDatetime: new Date()
  }
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
          provide: CommunityRegistrationService, useValue: jasmine.createSpyObj('communityRegistrationService', {
            'getUserRegistrations': of(response)
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
