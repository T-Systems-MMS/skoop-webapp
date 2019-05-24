import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
    ]
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
          useValue: jasmine.createSpyObj('userProjectService', {'getUserProjects': of(userProjects)})
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('usersService', {'getUserById': of(user)})
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
});
