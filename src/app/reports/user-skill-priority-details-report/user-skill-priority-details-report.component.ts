import { Component, OnInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserSkillPriorityReportsService } from '../user-skill-priority-reports.service';
import { UserSkillPriorityReportDetailsResponse } from '../user-skill-priority-report-details-response';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseError } from '../../error/response-error';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';

@Component({
  selector: 'app-user-skill-priority-details-report',
  templateUrl: './user-skill-priority-details-report.component.html',
  styleUrls: ['./user-skill-priority-details-report.component.scss']
})
export class UserSkillPriorityDetailsReportComponent implements OnInit {

  reportId: String;
  skillStatistics: UserSkillPriorityReportDetailsResponse[] = [];
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
        this.loadSkillStatistics(reportId);
      });
  }

  private loadSkillStatistics(reportId: string): void {
    this.userSkillPriorityReportsService.getUserSkillPriorityReportDetails(reportId)
      .subscribe(skillStatistics => { this.skillStatistics = skillStatistics; }
        , (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }

  backToReport() {
    this.router.navigate(['../', { reportId: this.reportId }], { relativeTo: this.activatedRoute });
  }

  goDetails(skillId: Number) {
    this.router.navigate(['users', skillId], { relativeTo: this.activatedRoute });
  }

}
