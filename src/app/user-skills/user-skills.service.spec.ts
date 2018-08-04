import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { UserSkillsService } from './user-skills.service';
import { UserSkill } from './user-skill';

describe('UserSkillsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserSkillsService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([UserSkillsService], (service: UserSkillsService) => {
    expect(service).toBeTruthy();
  }));

  it('should provide the user skills requested via API with the given user ID',
    async(inject([UserSkillsService], (service: UserSkillsService) => {
      const userSkillsTestData: UserSkill[] = [
        {
          skill: {
            id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
            name: 'Angular',
            description: 'JavaScript Framework'
          },
          currentLevel: 2,
          desiredLevel: 3,
          priority: 4
        },
        {
          skill: {
            id: '460d96f3-0deb-4b6c-9653-978a4f5fe76a',
            name: 'Spring Boot',
            description: 'Java Framework'
          },
          currentLevel: 3,
          desiredLevel: 4,
          priority: 2
        }
      ];

      service.getUserSkills('123').subscribe(userSkills => {
        expect(userSkills).toEqual(userSkillsTestData);
      });

      const request = httpTestingController.expectOne({ method: 'GET', url: '/api/users/123/skills' });

      expect(request.request.responseType).toEqual('json');

      request.flush(userSkillsTestData);
    })));

  it('should send the API request to create a user skill with the given data and provide the result',
    async(inject([UserSkillsService], (service: UserSkillsService) => {
      const userSkillTestData: UserSkill = {
        skill: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        currentLevel: 2,
        desiredLevel: 3,
        priority: 4
      };

      service.createUserSkill('123', 'Angular', 2, 3, 4).subscribe(userSkill => {
        expect(userSkill).toEqual(userSkillTestData);
      });

      const request = httpTestingController.expectOne({ method: 'POST', url: '/api/users/123/skills' });

      expect(request.request.responseType).toEqual('json');
      expect(request.request.headers.get('Content-Type')).toEqual('application/json');
      expect(request.request.body).toEqual({
        skillName: 'Angular',
        currentLevel: 2,
        desiredLevel: 3,
        priority: 4
      });

      request.flush(userSkillTestData);
    })));
});
