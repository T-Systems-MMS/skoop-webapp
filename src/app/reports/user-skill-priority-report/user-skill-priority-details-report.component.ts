import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { UserSkillPriorityReport } from './user-skill-priority-report';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';

@Component({
  selector: 'app-user-skill-priority-details-report',
  templateUrl: './user-skill-priority-details-report.component.html',
  styleUrls: ['./user-skill-priority-details-report.component.scss']
})
export class UserSkillPriorityDetailsReportComponent implements OnInit {

  reportId: String;
  report: UserSkillPriorityReport = null;
  errorMessage: string = null;

  constructor(
    private userSkillPriorityReportsService: UserSkillPriorityReportsService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('reportId')))
      .subscribe(reportId => {
        this.reportId = reportId;
        this.loadReport(reportId);
      });
  }

  private loadReport(reportId: string): void {
    this.userSkillPriorityReportsService.getReportDetails(reportId)
      .subscribe(report => { this.report = report; },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }

  backToReports() {
    this.router.navigate(['../', { reportId: this.reportId }], { relativeTo: this.activatedRoute });
  }

  showUsers(aggregationReportId: string) {
    this.router.navigate(['users', aggregationReportId], { relativeTo: this.activatedRoute });
  }

}
