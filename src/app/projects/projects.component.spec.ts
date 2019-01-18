import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { ProjectsService } from './projects.service';
import { Project } from './project';
import { of } from 'rxjs';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { ProjectsFilterPipe } from './projects-filter.pipe';

const projects = [
  {
    id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
    name: 'test1',
    customer: 'customer1',
    industrySector: 'industry sector1',
    description: 'description1',
    creationDate: new Date(),
    lastModifiedDate: new Date()
  },
  {
    id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
    name: 'test2',
    customer: 'customer2',
    industrySector: 'industry sector2',
    description: 'description2',
    creationDate: new Date(),
    lastModifiedDate: new Date()
  }
];

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
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
      declarations: [ProjectsComponent, ProjectsFilterPipe],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: ProjectsService, useValue: jasmine.createSpyObj('projectsService', {
            'getProjects': of<Project[]>(projects),
            'deleteProject': of<void>()
          })
        }
      ]
    })
      .compileComponents();

    projectService = TestBed.get(ProjectsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the list of projects', () => {
    expect(component.projects).toEqual(projects);
  });

});
