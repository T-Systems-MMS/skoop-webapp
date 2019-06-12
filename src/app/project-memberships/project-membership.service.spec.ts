import { async, TestBed } from '@angular/core/testing';

import { ProjectMembershipService } from './project-membership.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

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
    projectMembershipService.approveAll(userId).subscribe((data: any) => {
      expect(data).toBe(userId);
    });

    const req = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/projects/${userId}/approve-all`
    });

    req.flush(userId);
  }));
});
