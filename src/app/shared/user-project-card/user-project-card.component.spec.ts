import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectCardComponent } from './user-project-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { UserProject } from '../../user-projects/user-project';
import * as moment from 'moment';

const userProject: UserProject = {
  id: 1,
  role: 'developer',
  tasks: 'development',
  startDate: moment(),
  endDate: moment(),
  creationDate: moment(),
  lastModifiedDate: moment(),
  user: {
    id: '123',
    userName: 'username'
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
};

describe('UserProjectCardComponent', () => {
  let component: UserProjectCardComponent;
  let fixture: ComponentFixture<UserProjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatMomentDateModule
      ],
      declarations: [ UserProjectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProjectCardComponent);
    component = fixture.componentInstance;
    component.userProject = userProject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
