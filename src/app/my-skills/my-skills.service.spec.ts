import { TestBed, inject, async } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { MySkillsService } from './my-skills.service';
import { UserSkillsService } from '../user-skills/user-skills.service';
import { UserSkill } from '../user-skills/user-skill';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';

const userSkillsServiceStub: Partial<UserSkillsService> = {
  getUserSkills(userId: string): Observable<UserSkill[]> { return null; }
};

const userIdentityServiceStub: Partial<UserIdentityService> = {
  getUserIdentity(): Observable<UserIdentity> { return null; }
};

describe('MySkillsService', () => {
  beforeEach(() => {
    spyOn(userSkillsServiceStub, 'getUserSkills').and.returnValue(of([{
      skill: {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'Angular',
        description: 'JavaScript Framework'
      },
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    }]));
    spyOn(userIdentityServiceStub, 'getUserIdentity').and.returnValue(of({
      userId: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
      userName: 'tester',
      roles: ['ROLE_USER']
    }));
    TestBed.configureTestingModule({
      providers: [
        MySkillsService,
        { provide: UserSkillsService, useValue: userSkillsServiceStub },
        { provide: UserIdentityService, useValue: userIdentityServiceStub }
      ]
    });
  });

  it('should be created', inject([MySkillsService], (service: MySkillsService) => {
    expect(service).toBeTruthy();
  }));

  it('should request the user skills for the current user ID', async(inject([MySkillsService], (service: MySkillsService) => {
    service.getCurrentUserSkills().subscribe(userSkills => {
      expect(userIdentityServiceStub.getUserIdentity).toHaveBeenCalled();
      expect(userSkillsServiceStub.getUserSkills).toHaveBeenCalledWith('9a96f28f-8f50-40d9-be1c-605aedd9dfc9');
    });
  })));

  it('should return all the user skills data', async(inject([MySkillsService], (service: MySkillsService) => {
    service.getCurrentUserSkills().subscribe(userSkills => {
      expect(userSkills).toBeDefined();
      expect(userSkills.length).toBe(1);
      expect(userSkills[0].skill).toBeDefined();
      expect(userSkills[0].skill.id).toBe('e6b808eb-b6bd-447d-8dce-3e0d66b17759');
      expect(userSkills[0].skill.name).toBe('Angular');
      expect(userSkills[0].skill.description).toBe('JavaScript Framework');
      expect(userSkills[0].currentLevel).toBe(2);
      expect(userSkills[0].desiredLevel).toBe(3);
      expect(userSkills[0].priority).toBe(4);
    });
  })));
});
