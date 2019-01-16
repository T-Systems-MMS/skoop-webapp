import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectComponent } from './new-project.component';
import { MatBottomSheetRef } from "@angular/material";
import { ProjectsService } from "../projects.service";
import { Project } from "../project";
import { Observable, of } from "rxjs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { AppMaterialModule } from "../../app-material.module";
import { GlobalErrorHandlerService } from "../../error/global-error-handler.service";

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

const projectsServiceStub: Partial<ProjectsService> = {
  createProject(project: Project):
    Observable<Project> { return null; }
};

describe('NewProjectComponent', () => {
  let component: NewProjectComponent;
  let fixture: ComponentFixture<NewProjectComponent>;

  beforeEach(async(() => {
    spyOn(projectsServiceStub, 'createProject')
      .and.returnValue(of<Project>(
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'name',
        customer: 'customer',
        industrySector: 'industrySector',
        description: 'description',
        creationDate: new Date(),
        lastModifiedDate: new Date()
      }));
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ NewProjectComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: ProjectsService, useValue: projectsServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProjectComponent);
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

      expect(projectsServiceStub.createProject).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should not call the createProject method when name is empty', async(() => {
    component.projectForm.get('name').setValue('');
    component.projectForm.get('customer').setValue('customer');
    component.projectForm.get('industrySector').setValue('industrySector');
    component.projectForm.get('description').setValue('description');
    component.createProject();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(component.projectForm.valid).toBeFalsy();
      expect(projectsServiceStub.createProject).not.toHaveBeenCalled();
    });
  }));
});
