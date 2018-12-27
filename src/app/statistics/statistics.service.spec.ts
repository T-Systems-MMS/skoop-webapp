import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { StatisticsService } from './statistics.service';
import { UserSkillPriorityAggregation } from './user-skill-priority-aggregation';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StatisticsService]
    });
    service = TestBed.get(StatisticsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request the top prioritized skills from the server', async(() => {
    const testAggregations: UserSkillPriorityAggregation[] = [
      {
        skill: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        averagePriority: 3.5,
        maximumPriority: 4.0,
        userCount: 2
      },
      {
        skill: {
          id: 'c9b80869-c6bd-327d-u9ce-ye0d66b17129',
          name: 'Spring Boot',
          description: 'Java Framework'
        },
        averagePriority: 2.5,
        maximumPriority: 3.0,
        userCount: 4
      }
    ];

    service.getTopPrioritizedSkills().subscribe((aggregations) => {
      expect(aggregations).toEqual(testAggregations);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/statistics/skills/top-priority`
    });
    expect(request.request.responseType).toEqual('json');

    request.flush(testAggregations);
  }));
});
