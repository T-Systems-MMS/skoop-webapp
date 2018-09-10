import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserSkillPriorityReportsService } from '../user-skill-priority-reports.service';
import { UserSkillPriorityReportDetailsResponse } from '../user-skill-priority-report-details-response';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-skill-priority-details-report',
  templateUrl: './user-skill-priority-details-report.component.html',
  styleUrls: ['./user-skill-priority-details-report.component.scss']
})
export class UserSkillPriorityDetailsReportComponent implements OnInit {

  reportId: String;
  skillStatistics: UserSkillPriorityReportDetailsResponse[] = [];

  constructor(
    private userSkillPriorityReportsService: UserSkillPriorityReportsService,
    private router: Router,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('reportId')))
      .subscribe(reportId => {
        this.reportId = reportId;
        this.loadSkillStatistics(reportId);
      });
  }

  private loadSkillStatistics(reportId: string): void {
    this.userSkillPriorityReportsService.getUserSkillPriorityReportDetails(reportId)
      .subscribe(skillStatistics => this.skillStatistics = skillStatistics);
  }

  backToReport() {
    this.router.navigate(['../', { reportId: this.reportId }], { relativeTo: this.activatedRoute });
  }

  goDetails(skillId: Number) {
    console.log('skillId:' + skillId);
    this.router.navigate(['users', skillId], { relativeTo: this.activatedRoute });
  }

}
