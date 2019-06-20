import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed } from '@angular/core/testing';

import { MyProjectsNewComponent } from './my-projects-new.component';
import { AppMaterialModule } from '../app-material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MyProjectsService } from './my-projects.service';
import { of } from 'rxjs';
import { UserProject } from '../user-projects/user-project';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/project';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as moment from 'moment';
import { Util } from '../util/util';
import { AssignUserProjectRequest } from '../user-projects/assign-user-project-request';
import { Component, Input } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const projects: Project[] = [
  {
    id: '456',
    name: 'Project',
    creationDate: new Date(),
    customer: 'Customer',
    description: null,
    industrySector: 'Software development',
    lastModifiedDate: new Date()
  },
  {
    id: '123',
    name: 'Other',
    creationDate: new Date(),
    customer: 'Customer',
    description: null,
    industrySector: 'Software development',
    lastModifiedDate: new Date()
  },
];

describe('MyProjectsNewComponent', () => {
  let component: MyProjectsNewComponent;
  let fixture: ComponentFixture<MyProjectsNewComponent>;
  // to test autocomplete features
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProjectsNewComponent, SkillSelectInputStubComponent ],
      imports: [ AppMaterialModule, ReactiveFormsModule, MatMomentDateModule, BrowserAnimationsModule ],
      providers: [
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) },
        { provide: MyProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'assignProjectToCurrentUser': of<UserProject>()
          }) },
        { provide: ProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'getProjects': of<Project[]>(projects)
          }) },
        GlobalErrorHandlerService
      ]
    })
      .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProjectsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send a request to assign a project to a user', () => {
    component.formGroup.setValue({
      projectName: 'Test project',
      role: 'developer',
      tasks: 'development',
      startDate: Util.ignoreTimezone(moment('2019-01-10')),
      endDate: Util.ignoreTimezone(moment('2019-05-10')),
      skills: ['Java']
    });
    component.assignUserProject();
    const myProjectService: MyProjectsService = TestBed.get(MyProjectsService);
    expect(myProjectService.assignProjectToCurrentUser).toHaveBeenCalledWith({
      projectName: 'Test project',
      role: 'developer',
      tasks: 'development',
      startDate: Util.ignoreTimezone(moment('2019-01-10')),
      endDate: Util.ignoreTimezone(moment('2019-05-10')),
      skills: ['Java']
    } as AssignUserProjectRequest);
  });

  it('should filter projects based on input', fakeAsync(() => {
    sendInput('other');

    const options = overlayContainerElement.querySelectorAll('mat-option');
    expect(options.length).toBe(1);
    expect(options[0].innerHTML).toContain('Other');

    discardPeriodicTasks();

    function sendInput(text: string) {
      let inputElement: HTMLInputElement;

      inputElement = component.projectAutocompleteInput.nativeElement;
      inputElement.value = text;
      component.formGroup.controls.projectName.setValue(text);
      inputElement.dispatchEvent(new Event('focusin'));

      fixture.detectChanges();
    }
  }));

});
