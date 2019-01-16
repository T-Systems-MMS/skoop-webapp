import { async, TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from "../../environments/environment";
import { Project } from "./project";

describe('ProjectsService', () => {
  let httpTestingController: HttpTestingController;
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectsService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ProjectsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: ProjectsService = TestBed.get(ProjectsService);
    expect(service).toBeTruthy();
  });

  it('should provide list of projects', async(() => {
    const testProjects: Project[] = [
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

    service.getProjects().subscribe((projects) => {
      expect(projects).toEqual(testProjects);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/projects`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testProjects);
  }));

  it('should update the project with the given data', async(() => {
    const testProject: Project = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      name: 'test1',
      customer: 'customer1',
      industrySector: 'industry sector1',
      description: 'description1',
    } as Project;

    service.updateProject(testProject).subscribe(project => {
      expect(project).toEqual(testProject);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/projects/${testProject.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual(testProject);

    request.flush(testProject);
  }));

  it('should create the project with the given data', async(() => {
    const testProject: Project = {
      name: 'test1',
      customer: 'customer1',
      industrySector: 'industry sector1',
      description: 'description1',
    } as Project;

    service.createProject(testProject).subscribe(project => {
      expect(project).toEqual(testProject);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/projects`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual(testProject);

    request.flush(testProject);
  }));

  it('should delete the project', async(() => {
    const projectId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    service.deleteProject(projectId).subscribe((data: any) => {
      expect(data).toBe(projectId);
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/projects/${projectId}`
    });
    expect(req.request.method).toBe('DELETE');

    req.flush(projectId);
  }));

});
