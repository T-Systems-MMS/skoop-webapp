import { TestBed } from '@angular/core/testing';

import { UserProjectsService } from './user-projects.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserProject } from './user-project';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { UpdateUserProjectRequest } from './update-user-project-request';
import { AssignUserProjectRequest } from './assign-user-project-request';

describe('UserProjectsService', () => {

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

  let service: UserProjectsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(UserProjectsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user projects', () => {

    service.getUserProjects('123').subscribe((response: UserProject[]) => {
      expect(response.length).toBe(1);
      expect(response).toContain(userProjects[0]);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/123/projects`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(userProjects);
  });

  it('should return data of an updated project', () => {

    const updateUserProjectRequest: UpdateUserProjectRequest = {
      role: 'developer',
      tasks: 'development',
      startDate: moment(),
      endDate: moment()
    };
    service.updateUserProject('123', '456', updateUserProjectRequest).subscribe((response: UserProject) => {
      expect(response).toEqual(userProject);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/123/projects/456`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(userProject);
  });

  it('should return data of a project assigned to a user', () => {
    const assignUserProjectRequest: AssignUserProjectRequest = {
      projectName: 'Test project',
      role: 'developer',
      tasks: 'development',
      startDate: moment(),
      endDate: moment()
    };
    service.assignProjectToUser('123', assignUserProjectRequest).subscribe((response: UserProject) => {
      expect(response).toEqual(userProject);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/123/projects`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(userProject);
  });

  it('should return nothing when a project is deleted', () => {
    service.deleteUserProject('123', '456').subscribe((response: void) => {
      expect(response).toBeNull();
    });

    const request = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/users/123/projects/456`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(null);
  });

});
