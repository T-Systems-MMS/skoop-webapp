import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsNewComponent } from './projects-new.component';
import { MatBottomSheetRef } from '@angular/material';
import { ProjectsService } from './projects.service';
import { Project } from './project';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { By } from '@angular/platform-browser';


describe('ProjectsNewComponent', () => {
  let component: ProjectsNewComponent;
  let fixture: ComponentFixture<ProjectsNewComponent>;
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
      declarations: [ ProjectsNewComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: ProjectsService, useValue: jasmine.createSpyObj('projectsService', {'createProject': of<Project>() } ) },
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) }
      ]
    })
    .compileComponents();

    projectService = TestBed.get(ProjectsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createProject method', async(() => {
    component.projectForm.get('name').setValue('name');
    component.projectForm.get('customer').setValue('customer');
    component.projectForm.get('industrySector').setValue('industrySector');
    component.projectForm.get('description').setValue('description');
    component.createProject();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const expectedRequestData: Project = {
        name: 'name',
        customer: 'customer',
        industrySector: 'industrySector',
        description: 'description',
      } as Project;

      expect(projectService.createProject).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should disable createButton when name is empty', async(() => {
    component.projectForm.reset();
    component.projectForm.get('name').setValue('');
    component.projectForm.get('customer').setValue('customer');
    component.projectForm.get('industrySector').setValue('industrySector');
    component.projectForm.get('description').setValue('description');

    const createButton = fixture.debugElement.query(By.css('#project-new-button'));
    expect(createButton.nativeElement.disabled).toBeTruthy();
  }));
});
