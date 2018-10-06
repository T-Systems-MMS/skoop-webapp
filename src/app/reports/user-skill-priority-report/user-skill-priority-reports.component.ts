import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { UserSkillPriorityReportSimple } from './user-skill-priority-report-simple';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';

@Component({
  selector: 'app-user-skill-priority-reports',
  templateUrl: './user-skill-priority-reports.component.html',
  styleUrls: ['./user-skill-priority-reports.component.scss']
})
export class UserSkillPriorityReportsComponent implements OnInit {
  reports: UserSkillPriorityReportSimple[] = [];
  errorMessage: string = null;

  constructor(private userSkillPriorityReportsService: UserSkillPriorityReportsService,
    private router: Router, public activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit(): void {
    this.loadUserSkillPriorityReports();
  }

  private loadUserSkillPriorityReports(): void {
    this.userSkillPriorityReportsService.getReports().subscribe(
      (reports) => {
        this.reports = reports;
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  openReport(reportId: string) {
    this.router.navigate([reportId], { relativeTo: this.activatedRoute });
  }

  createReport() {
    this.userSkillPriorityReportsService.createReport().subscribe(
      (newReport) => {
        this.reports.unshift(newReport);
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }
}
