import { TestBed, inject } from '@angular/core/testing';

import { SkillGroupsService } from './skill-groups.service';

describe('GroupsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillGroupsService]
    });
  });

  it('should be created', inject([SkillGroupsService], (service: SkillGroupsService) => {
    expect(service).toBeTruthy();
  }));
});
