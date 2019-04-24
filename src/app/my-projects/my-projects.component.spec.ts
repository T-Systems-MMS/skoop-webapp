import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsComponent } from './my-projects.component';
import { AppMaterialModule } from '../app-material.module';
import { MyProjectsService } from './my-projects.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserProject } from '../user-projects/user-project';
import { of } from 'rxjs';
import * as moment from 'moment';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyProjectsEditComponent } from './my-projects-edit.component';
import { MyProjectsNewComponent } from './my-projects-new.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/project';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('MyProjectsComponent', () => {
  let component: MyProjectsComponent;
  let fixture: ComponentFixture<MyProjectsComponent>;

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

  const userProjects: UserProject[] = [ userProject ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyProjectsComponent,
        MyProjectsEditComponent,
        MyProjectsNewComponent,
        DeleteConfirmationDialogComponent,
        SkillSelectInputStubComponent
      ],
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatMomentDateModule
      ],
      providers: [
        { provide: MyProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'getCurrentUserProjects': of<UserProject[]>(userProjects),
            'deleteCurrentUserProject': of<void>()
          }) },
        { provide: ProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'getProjects': of<Project[]>([])
          }) },
        GlobalErrorHandlerService
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [MyProjectsEditComponent, MyProjectsNewComponent, DeleteConfirmationDialogComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(MyProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open edit user project dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openEditDialog(userProject);

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(MyProjectsEditComponent));
    m._openedBottomSheetRef.dismiss();
  }));

  it('should open new user project dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openNewDialog();

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(MyProjectsNewComponent));
    m._openedBottomSheetRef.dismiss();
  }));

  it('should open confirmation dialog before removal of a user project', async(() => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    component.delete(userProject);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
  }));

});
