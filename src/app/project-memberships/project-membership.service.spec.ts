import { async, TestBed } from '@angular/core/testing';

import { ProjectMembershipService } from './project-membership.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { ApproveUserProjectRequest } from './approve-user-project-request';
import * as moment from 'moment';
import { UserProject } from '../user-projects/user-project';

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

describe('ProjectMembershipService', () => {
  let httpTestingController: HttpTestingController;
  let projectMembershipService: ProjectMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectMembershipService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    projectMembershipService = TestBed.get(ProjectMembershipService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(projectMembershipService).toBeTruthy();
  });

  it('should approve all project memberships', async(() => {
    const userId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    const unapprovedProjects: ApproveUserProjectRequest[] = [
      {
        projectId: '123456',
        role: 'Developer',
        skills: ['Java'],
        tasks: 'Development',
        startDate: moment(),
        endDate: moment(),
        approved: true
      }
    ];
    projectMembershipService.approveAll(userId, unapprovedProjects).subscribe((data: any) => {
      expect(data).toBe(userProjects);
    });

    const req = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${userId}/projects`
    });
    expect(req.request.responseType).toEqual('json');

    req.flush(userProjects);
  }));
});
