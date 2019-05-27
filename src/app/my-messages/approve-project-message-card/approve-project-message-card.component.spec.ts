import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveProjectMessageCardComponent } from './approve-project-message-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';
import { NotificationType } from '../notification-type.enum';
import { ProjectRequiresApprovalNotification } from './project-requires-approval-notification';
import * as moment from 'moment';

const notification: ProjectRequiresApprovalNotification = {
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
    },
    {
      id: 2,
      role: 'developer',
      tasks: 'development',
      startDate: moment(),
      endDate: moment(),
      creationDate: moment(),
      lastModifiedDate: moment(),
      user: {
        id: '1234567',
        userName: 'username2',
        firstName: 'Other',
        lastName: 'User'
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
};

describe('ApproveProjectMessageCardComponent', () => {
  let component: ApproveProjectMessageCardComponent;
  let fixture: ComponentFixture<ApproveProjectMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ ApproveProjectMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveProjectMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
