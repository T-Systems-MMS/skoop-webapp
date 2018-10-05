import { TestBed, async } from '@angular/core/testing';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { UserSkillPriorityReportMetaData } from './user-skill-priority-report-meta-data';

const mockReportsData: UserSkillPriorityReportMetaData[] = [
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b1773y',
    date: new Date('2018-09-25T12:00:00Z'),
    skillCount: 2
  },
  {
    id: '89b808eb-b6bd-447d-8dce-3e0d66b17759',
    date: new Date('2018-09-26T12:16:00Z'),
    skillCount: 3
  }
];

describe('UserSkillPriorityReportsService', () => {
  let service: UserSkillPriorityReportsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserSkillPriorityReportsService]
    });
    service = TestBed.get(UserSkillPriorityReportsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should provide all reports requested via API', async(() => {
    service.getReports().subscribe(reports => {
      expect(reports).toBeDefined();
      expect(reports).toEqual(mockReportsData);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/reports/skills/priority`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(mockReportsData);
  }));

  it('should send the API request to create a report of available data', async(() => {
    service.createReport().subscribe(createdReport => {
      expect(createdReport).toBeDefined();
      expect(createdReport).toEqual(mockReportsData[0]);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/reports/skills/priority`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.headers.get('Content-Type')).toEqual('application/json');
    expect(request.request.body).toEqual(null);

    // What data do I actually want to return back from that HTTP call
    request.flush(mockReportsData[0]);
  }));
});
