import { TestBed } from '@angular/core/testing';

import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { SkillUsersService } from './skill-users.service';
import { environment } from '../../environments/environment';
import { SkillUser } from './skill-user';

describe('SkillUsersService', () => {
  let skillUsersService: SkillUsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkillUsersService]
    });
    skillUsersService = TestBed.get(SkillUsersService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(skillUsersService).toBeTruthy();
  });

  it('should provide list of SkillUsers by skillId', () => {
    const skillId = '123456';
    const expectedResponse: SkillUser[] = [
      {
        user: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'tester',
          firstName: 'Toni',
          lastName: 'Tester',
        },
        currentLevel: 2,
        desiredLevel: 3,
        priority: 2
      },
      {
        user: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b16666',
          userName: 'otherTester',
          firstName: 'Other',
          lastName: 'Tester',
        },
        currentLevel: 2,
        desiredLevel: 3,
        priority: 2
      }
    ];
    skillUsersService.getSkillUsers(skillId).subscribe(actualSkillUsers => {
      expect(actualSkillUsers.length).toBe(2);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/skills/${skillId}/users`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedResponse);
  });

});
