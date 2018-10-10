import { TestBed, inject } from '@angular/core/testing';

import { SkillGroupsService } from './skill-groups.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('SkillGroupsService', () => {
  let service: SkillGroupsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkillGroupsService]
    });
    service = TestBed.get(SkillGroupsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
