import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProjectComponent } from './edit-project.component';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';
import { of } from 'rxjs';
import { ProjectsService } from '../projects.service';
import { Project } from '../project';
import { By } from '@angular/platform-browser';

const projectTestData: Project = {
  id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  name: 'Project name',
  customer: 'Customer',
  industrySector: 'Industry sector',
  description: 'Description',
} as Project;

describe('EditProjectComponent', () => {
  let component: EditProjectComponent;
  let fixture: ComponentFixture<EditProjectComponent>;
  let projectService: ProjectsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ EditProjectComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: ProjectsService, useValue: jasmine.createSpyObj('projectsService', {'updateProject': of<Project>() } ) },
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: projectTestData }
      ]
    })
    .compileComponents();

    projectService = TestBed.get(ProjectsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the edit-project form', () => {
    expect(component.projectForm.get('name').value).toBe(projectTestData.name);
    expect(component.projectForm.get('customer').value).toBe(projectTestData.customer);
    expect(component.projectForm.get('industrySector').value).toBe(projectTestData.industrySector);
    expect(component.projectForm.get('description').value).toBe(projectTestData.description);
  });

  it('should update the edit-project form', async(() => {
    component.projectForm.get('name').setValue('Changed name');
    component.projectForm.get('customer').setValue('Changed customer');
    component.projectForm.get('industrySector').setValue('Changed industrySector');
    component.projectForm.get('description').setValue('Changed description');
    component.editProject();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.projectForm.get('name').value).toBe('Changed name');
      expect(component.projectForm.get('customer').value).toBe('Changed customer');
      expect(component.projectForm.get('industrySector').value).toBe('Changed industrySector');
      expect(component.projectForm.get('description').value).toBe('Changed description');

      const expectedRequestData: Project = {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'Changed name',
        customer: 'Changed customer',
        industrySector: 'Changed industrySector',
        description: 'Changed description',
      } as Project;

      expect(projectService.updateProject).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should disable editButton when name is empty', async(() => {
    component.projectForm.get('name').setValue('');
    component.projectForm.get('customer').setValue('customer');
    component.projectForm.get('industrySector').setValue('industrySector');
    component.projectForm.get('description').setValue('description');

    const editButton = fixture.debugElement.query(By.css('#project-edit-button'));
    expect(editButton.nativeElement.disabled).toBeTruthy();
  }));
});
