import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProjectsNewComponent } from './my-projects-new.component';
import { AppMaterialModule } from '../app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { MyProjectsService } from './my-projects.service';
import { of } from 'rxjs';
import { UserProject } from '../user-projects/user-project';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/project';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MyProjectsNewComponent', () => {
  let component: MyProjectsNewComponent;
  let fixture: ComponentFixture<MyProjectsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyProjectsNewComponent ],
      imports: [ AppMaterialModule, ReactiveFormsModule, MatMomentDateModule, BrowserAnimationsModule ],
      providers: [
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) },
        { provide: MyProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'assignProjectToCurrentUser': of<UserProject>()
          }) },
        { provide: ProjectsService, useValue: jasmine.createSpyObj('myProjectsService', {
            'getProjects': of<Project[]>([])
          }) },
        GlobalErrorHandlerService
      ]
    })
      .compileComponents();
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
    component.assignUserProject();
    const myProjectService: MyProjectsService = TestBed.get(MyProjectsService);
    expect(myProjectService.assignProjectToCurrentUser).toHaveBeenCalled();
  });

});
