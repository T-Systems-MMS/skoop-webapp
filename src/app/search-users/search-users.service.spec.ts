import { async, TestBed } from '@angular/core/testing';

import { SearchUsersService } from './search-users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { AnonymousUserSkill } from './anonymous-user-skill';

describe('SearchUsersService', () => {
  let httpTestingController: HttpTestingController;
  let service: SearchUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchUsersService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SearchUsersService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const searchUsersService: SearchUsersService = TestBed.get(SearchUsersService);
    expect(searchUsersService).toBeTruthy();
  });

  it('should search user profiles which satisfy given skill requirements', async(() => {
    const expectedUsers: AnonymousUserSkill[] = [
      {
        userReferenceId: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
        skills: [
          {
            skillName: 'Spring',
            currentLevel: 2
          },
          {
            skillName: 'Angular',
            currentLevel: 2
          }
        ]
      },
      {
        userReferenceId: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
        skills: [
          {
            skillName: 'Spring',
            currentLevel: 4
          },
          {
            skillName: 'Angular',
            currentLevel: 3
          }
        ]
      }
    ];

    const criteriaList: string[] = [
      '123456789abcde+1',
      '987654321edcba+2'
    ];

    service.search(criteriaList).subscribe((actualUsers) => {
      expect(actualUsers).toEqual(expectedUsers);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/search/users?params=123456789abcde%2B1%2C987654321edcba%2B2`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedUsers);
  }));
});
