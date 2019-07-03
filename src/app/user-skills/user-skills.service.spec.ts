import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../environments/environment';
import { UserSkillsService } from './user-skills.service';
import { UserSkill } from './user-skill';
import { UpdateUserSkillRequest } from '../my-skills/update-user-skill-request';

describe('UserSkillsService', () => {
  let service: UserSkillsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserSkillsService]
    });
    service = TestBed.get(UserSkillsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 3 skill suggestions based on the search and userId', async(() => {
    const mockSkillsName = ['Java', 'Maven', 'Angular'];

    service.getUserSkillSuggestions('123', 'a').subscribe(skills => {
      expect(skills).toBeDefined();
      expect(skills.length).toBe(3);
      expect(skills).toEqual(mockSkillsName);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/123/skill-suggestions?search=a`
    });
    expect(request.request.responseType).toEqual('json');
    expect(request.request.url).toBe(`${environment.serverApiUrl}/users/123/skill-suggestions`);
    expect(request.request.params.get('search')).toEqual('a');

    request.flush(mockSkillsName);
  }));

  it('should return no suggestions based on the null search value', async(() => {
    const mockSkillsName = [];
    service.getUserSkillSuggestions('123', null).subscribe(skills => {
      expect(skills).toBeDefined();
      expect(skills.length).toBe(0);
      expect(skills).toEqual(mockSkillsName);
    });
  }));

  it('should provide the user skills requested via API with the given user ID', async(() => {
    const mockUserSkillsData: UserSkill[] = [
      {
        skill: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        currentLevel: 2,
        desiredLevel: 3,
        priority: 4,
        favorite: false
      },
      {
        skill: {
          id: '460d96f3-0deb-4b6c-9653-978a4f5fe76a',
          name: 'Spring Boot',
          description: 'Java Framework'
        },
        currentLevel: 3,
        desiredLevel: 4,
        priority: 2,
        favorite: false
      }
    ];

    service.getUserSkills('123').subscribe(userSkills => {
      expect(userSkills).toBeDefined();
      expect(userSkills.length).toBe(2);
      expect(userSkills).toEqual(mockUserSkillsData);

      expect(userSkills[0].skill).toBeDefined();
      expect(userSkills[0].skill.id).toBe('e6b808eb-b6bd-447d-8dce-3e0d66b17759');
      expect(userSkills[0].skill.name).toBe('Angular');
      expect(userSkills[0].skill.description).toBe('JavaScript Framework');
      expect(userSkills[0].currentLevel).toBe(2);
      expect(userSkills[0].desiredLevel).toBe(3);
      expect(userSkills[0].priority).toBe(4);

      expect(userSkills[1].skill).toBeDefined();
      expect(userSkills[1].skill.id).toBe('460d96f3-0deb-4b6c-9653-978a4f5fe76a');
      expect(userSkills[1].skill.name).toBe('Spring Boot');
      expect(userSkills[1].skill.description).toBe('Java Framework');
      expect(userSkills[1].currentLevel).toBe(3);
      expect(userSkills[1].desiredLevel).toBe(4);
      expect(userSkills[1].priority).toBe(2);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/123/skills`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(mockUserSkillsData);
  }));

  it('should create a user skill with the given data and provide the result', async(() => {
    const mockUserSkillData: UserSkill = {
      skill: {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'Angular',
        description: 'JavaScript Framework'
      },
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4,
      favorite: false
    };

    service.createUserSkill('123', 'Angular', 2, 3, 4).subscribe(userSkill => {
      expect(userSkill).toEqual(mockUserSkillData);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/123/skills`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual({
      skillName: 'Angular',
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    });

    request.flush(mockUserSkillData);
  }));

  it('should update a user skill with the given data and provide the result', async(() => {
    const mockUserSkillData: UserSkill = {
      skill: {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'Angular',
        description: 'JavaScript Framework'
      },
      currentLevel: 3,
      desiredLevel: 4,
      priority: 0,
      favorite: true
    };

    const requestData: UpdateUserSkillRequest = {
      currentLevel: 3,
      desiredLevel: 4,
      priority: 0,
      favorite: true
    };

    service.updateUserSkill('123', '456', requestData).subscribe(userSkill => {
      expect(userSkill).toEqual(mockUserSkillData);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/123/skills/456`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual({
      currentLevel: 3,
      desiredLevel: 4,
      priority: 0,
      favorite: true
    });

    request.flush(mockUserSkillData);
  }));
});
