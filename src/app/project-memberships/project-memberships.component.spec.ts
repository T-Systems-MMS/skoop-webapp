import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { ProjectMembershipsComponent } from './project-memberships.component';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { UsersService } from '../users/users.service';
import * as moment from 'moment';
import { UserProjectCardComponent } from '../shared/user-project-card/user-project-card.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';
import { NotificationCounterService } from '../shared/notification-counter.service';
import { ProjectMembershipService } from './project-membership.service';
import { ApproveUserProjectRequest } from './approve-user-project-request';

const userProjects = [
  {
    id: 1,
    role: 'developer',
    tasks: 'development',
    startDate: moment(),
    endDate: moment(),
    creationDate: moment(),
    lastModifiedDate: moment(),
    user:  {
      id: '111285af-df9d-4e61-8e56-1b9895b36321',
      userName: 'user1',
      firstName: 'Name1',
      lastName: 'Surname1',
      email: 'user1@mail.com',
      phoneNumber: '1234567890'
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
    skills: [
      {
        id: '1f5082a3-f7cf-4d6b-ad41-df8bce06e03f',
        name: 'Java',
        description: 'Java programming language.',
        skillGroups: null
      }
    ],
    approved: false
  },
  {
    id: 2,
    role: 'test',
    tasks: 'testing',
    startDate: moment(),
    endDate: moment(),
    creationDate: moment(),
    lastModifiedDate: moment(),
    user:  {
      id: '111285af-df9d-4e61-8e56-1b9895b36321',
      userName: 'user1',
      firstName: 'Name1',
      lastName: 'Surname1',
      email: 'user1@mail.com',
      phoneNumber: '1234567890'
    },
    project: {
      id: '12345678',
      name: 'Project2',
      creationDate: new Date(),
      customer: 'Customer',
      description: null,
      industrySector: 'Software development and testing',
      lastModifiedDate: new Date()
    },
    skills: [],
    approved: true
  }
];

const user =  {
  id: '111285af-df9d-4e61-8e56-1b9895b36321',
  userName: 'user1',
  firstName: 'Name1',
  lastName: 'Surname1',
  email: 'user1@mail.com',
  phoneNumber: '1234567890'
};

describe('ProjectMembershipsComponent', () => {
  let component: ProjectMembershipsComponent;
  let fixture: ComponentFixture<ProjectMembershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatMomentDateModule,
        RouterTestingModule
      ],
      declarations: [ ProjectMembershipsComponent, UserProjectCardComponent ],
      providers: [
        {
          provide: UserProjectsService,
          useValue: jasmine.createSpyObj('userProjectService', {
            'getUserProjects': of(userProjects),
            'updateUserProject': of(userProjects[0])
          })
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('usersService', {'getUserById': of(user)})
        },
        {
          provide: NotificationCounterService, useValue: jasmine.createSpyObj('notificationCounterService', {
            'loadCount': of()
          })
        },
        {
          provide: ProjectMembershipService,
          useValue: jasmine.createSpyObj('projectMembershipService', {'approveAll': of()})
        },
        GlobalErrorHandlerService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call UserProjectsService.updateUserProject with expected parameters', fakeAsync(() => {
    const expectedResponse: UpdateUserProjectRequest = {
      role: userProjects[0].role,
      skills: ['Java'],
      tasks: userProjects[0].tasks,
      startDate: userProjects[0].startDate,
      endDate: userProjects[0].endDate,
      approved: true
    };

    component.onApprove(userProjects[0]);
    fixture.detectChanges();

    const userProjectsService: UserProjectsService = TestBed.get(UserProjectsService);
    expect(userProjectsService.updateUserProject).toHaveBeenCalledWith(user.id, userProjects[0].project.id, expectedResponse);
  }));

  it('should show Approve All button when there is at least one unapproved project', () => {
    expect(component.showApproveAll()).toBeTruthy();
  });

  it('should call ProjectMembershipService.approveAll with expected subordinate id and list of projects', fakeAsync(() => {
    const expectedRequestBody: ApproveUserProjectRequest[] = [
      {
        projectId: userProjects[0].project.id,
        role: userProjects[0].role,
        skills: ['Java'],
        tasks: userProjects[0].tasks,
        startDate: userProjects[0].startDate,
        endDate: userProjects[0].endDate,
        approved: true
      }
    ];
    component.approveAll();
    fixture.detectChanges();

    const projectMembershipService: ProjectMembershipService = TestBed.get(ProjectMembershipService);
    expect(projectMembershipService.approveAll).toHaveBeenCalledWith(user.id, expectedRequestBody);
  }));

  it('should hide Approve All button when all projects are approved', () => {
    userProjects[0].approved = true;
    fixture.detectChanges();

    expect(component.showApproveAll()).toBeFalsy();
  });
});
