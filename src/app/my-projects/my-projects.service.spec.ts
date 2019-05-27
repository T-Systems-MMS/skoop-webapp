import { async, TestBed } from '@angular/core/testing';

import { MyProjectsService } from './my-projects.service';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserProjectsService } from '../user-projects/user-projects.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { UserProject } from '../user-projects/user-project';
import * as moment from 'moment';
import { UserIdentity } from '../shared/user-identity';
import { of } from 'rxjs';
import { AssignUserProjectRequest } from '../user-projects/assign-user-project-request';
import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';

describe('MyProjectsService', () => {

  let service: MyProjectsService;
  let httpTestingController: HttpTestingController;

  const authenticatedUser: UserIdentity = {
    userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'tester',
    firstName: 'Toni',
    lastName: 'Tester',
    email: 'toni.tester@skoop.io',
    roles: ['ROLE_USER']
  };

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
    ],
    approved: true
  };

  const userProjects: UserProject[] = [ userProject ];

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserProjectsService,
        { provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })}
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(MyProjectsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return projects of authenticated user', async(() => {

    service.getCurrentUserProjects().subscribe((response: UserProject[]) => {
      expect(response.length).toBe(1);
      expect(response).toContain(userProjects[0]);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/projects`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(userProjects);

  }));

  it('should return the project assigned to a user', async(() => {
    const assignUserProjectRequest: AssignUserProjectRequest = {
      projectName: 'Test project',
      role: 'developer',
      tasks: 'development',
      startDate: moment(),
      endDate: moment()
    };
    service.assignProjectToCurrentUser(assignUserProjectRequest).subscribe((response: UserProject) => {
      expect(response).toEqual(userProject);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/projects`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(userProject);

  }));

  it('should return updated project when user project is updated', async(() => {
    const updateUserProjectRequest: UpdateUserProjectRequest = {
      role: 'developer',
      tasks: 'development',
      startDate: moment(),
      endDate: moment()
    };
    service.updateCurrentUserProject('123', updateUserProjectRequest).subscribe((response: UserProject) => {
      expect(response).toEqual(userProject);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/projects/123`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(userProject);

  }));

  it('should return nothing when a project is deleted', async(() => {

    service.deleteCurrentUserProject('123').subscribe((response: void) => {
      expect(response).toBeNull();
    });

    const request = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/projects/123`
    });

    expect(request.request.responseType).toEqual('json');
    request.flush(null);

  }));

});
