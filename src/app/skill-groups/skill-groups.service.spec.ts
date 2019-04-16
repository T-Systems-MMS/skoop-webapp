import { async, TestBed } from '@angular/core/testing';

import { SkillGroupsService } from './skill-groups.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { SkillGroup } from './skill-group';

describe('SkillGroupsService', () => {
  let skillGroupsService: SkillGroupsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkillGroupsService]
    });
    skillGroupsService = TestBed.get(SkillGroupsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(skillGroupsService).toBeTruthy();
  });

  it('should not send request for empty search string', () => {
    const searchParam = '';
    skillGroupsService.getSkillGroupSuggestions(searchParam).subscribe(actualUsers => {
      expect(actualUsers.length).toBe(0);
    });

    httpTestingController.expectNone( `${environment.serverApiUrl}/group-suggestions?search=${searchParam}`);
  });

  it('should suggest list of group names according to the search param', () => {
    const searchParam = 'group';
    const expectedGroups: string[] = ['group first', 'group second'];

    skillGroupsService.getSkillGroupSuggestions(searchParam).subscribe(actualGroups => {
      expect(actualGroups.length).toBe(2);
      expect(actualGroups).toEqual(expectedGroups);
    });

    const req = httpTestingController.expectOne( `${environment.serverApiUrl}/group-suggestions?search=${searchParam}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedGroups);
  });

  it('should get all skill groups', () => {
    const expectedResponse: SkillGroup[] = [
      {
        id: '123123',
        name: 'Skill group 1'
      },
      {
        id: '3453465',
        name: 'Skill group 2'
      },
      {
        id: '7456734',
        name: 'Skill group 3'
      }
    ];

    skillGroupsService.getAllSkillGroups().subscribe((groups) => {
      expect(groups).toEqual(expectedResponse);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/groups`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedResponse);
  });

  it('should get skill group by its id', () => {
    const expectedResponse: SkillGroup = {
      id: '123123',
      name: 'Skill group 1'
    };

    skillGroupsService.getSkillGroup(expectedResponse.id).subscribe((group) => {
      expect(group).toEqual(expectedResponse);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/groups/${expectedResponse.id}`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedResponse);
  });

  it('should create skill group', () => {
    const expectedResponse: SkillGroup = {
      id: '123123',
      name: 'Skill group 1',
      description: 'Skill group description'
    };

    skillGroupsService.createSkillGroup(expectedResponse.name, expectedResponse.description).subscribe((group) => {
      expect(group).toEqual(expectedResponse);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'POST'
      && req.url === `${environment.serverApiUrl}/groups`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedResponse);
  });

  it('should update skill group', () => {
    const expectedResponse: SkillGroup = {
      id: '123123',
      name: 'Skill group 1',
      description: 'Skill group description'
    };

    skillGroupsService.updateSkillGroup(expectedResponse.id, expectedResponse.name, expectedResponse.description).subscribe((group) => {
      expect(group).toEqual(expectedResponse);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'PUT'
      && req.url === `${environment.serverApiUrl}/groups/${expectedResponse.id}`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(expectedResponse);
  });

  it('should delete the group', async(() => {
    const groupId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    skillGroupsService.deleteSkillGroup(groupId).subscribe((data: any) => {
      expect(data).toBe(groupId);
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/groups/${groupId}`
    });
    expect(req.request.method).toBe('DELETE');

    req.flush(groupId);
  }));

  it('should not send request to check if the skill already exists for empty search string', () => {
    const searchParam = '';
    skillGroupsService.isSkillGroupExist(searchParam).subscribe(actualResponse => {
      expect(actualResponse).toBeFalsy()
    });

    httpTestingController.expectNone( `${environment.serverApiUrl}/groups/group-existence?search=${searchParam}`);
  });

  it('should send a request to check if the skill already exists', () => {
    const searchParam = 'group';

    skillGroupsService.isSkillGroupExist(searchParam).subscribe(actualResponse => {
      expect(actualResponse).toBeTruthy()
    });

    const req = httpTestingController.expectOne( `${environment.serverApiUrl}/groups/group-existence?search=${searchParam}`);
    expect(req.request.method).toBe('GET');
    req.flush(1);
  });
});
