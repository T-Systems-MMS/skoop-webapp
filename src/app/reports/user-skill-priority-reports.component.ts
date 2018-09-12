import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { UserSkillPriorityReportResponse } from './user-skill-priority-report-response';
import { ResponseError } from '../error/response-error';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-user-skill-priority-reports',
  templateUrl: './user-skill-priority-reports.component.html',
  styleUrls: ['./user-skill-priority-reports.component.scss']
})
export class UserSkillPriorityReportsComponent implements OnInit {
  priorityReports: UserSkillPriorityReportResponse[] = [];
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
    this.userSkillPriorityReportsService.getReports()
      .subscribe(priorityReports => {
        this.priorityReports = priorityReports;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  goDetails(id: Number) {
    this.router.navigate([id], { relativeTo: this.activatedRoute });
  }

  createReport() {
    this.userSkillPriorityReportsService.createRport()
      .subscribe(newReport => {
        this.priorityReports.unshift(newReport);
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }
}
