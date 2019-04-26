import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsEditComponent } from './my-projects-edit.component';
import { AppMaterialModule } from '../app-material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { MyProjectsService } from './my-projects.service';
import { of } from 'rxjs';
import { UserProject } from '../user-projects/user-project';
import { Project } from '../projects/project';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as moment from 'moment';
import { Util } from '../util/util';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('MyProjectsEditComponent', () => {
  let component: MyProjectsEditComponent;
  let fixture: ComponentFixture<MyProjectsEditComponent>;

  const userProject: UserProject = {
    id: 1,
    role: 'developer',
    tasks: 'development',
    startDate: Util.ignoreTimezone(moment('2019-01-10')),
    endDate: Util.ignoreTimezone(moment('2019-05-10')),
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProjectsEditComponent, SkillSelectInputStubComponent ],
      imports: [ AppMaterialModule, ReactiveFormsModule, MatMomentDateModule, BrowserAnimationsModule ],
      providers: [
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: userProject },
        { provide: MyProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'updateCurrentUserProject': of<UserProject>(null)
          }) },
        GlobalErrorHandlerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill in the form with expected values', () => {
    expect(component.formGroup.get('projectName').value).toBe('Project');
    expect(component.formGroup.get('role').value).toBe('developer');
    expect(component.formGroup.get('tasks').value).toBe('development');
    expect(component.formGroup.get('startDate').value).toEqual(Util.ignoreTimezone(moment('2019-01-10')));
    expect(component.formGroup.get('endDate').value).toEqual(Util.ignoreTimezone(moment('2019-05-10')));
  });

  it('should send a request to update user project', () => {
    component.updateUserProject();
    const myProjectService: MyProjectsService = TestBed.get(MyProjectsService);

    expect(myProjectService.updateCurrentUserProject).toHaveBeenCalledWith('456', {
      role: 'developer',
      tasks: 'development',
      startDate: Util.ignoreTimezone(moment('2019-01-10')),
      endDate: Util.ignoreTimezone(moment('2019-05-10')),
      skills: ['Java'],
    });
  });

});
