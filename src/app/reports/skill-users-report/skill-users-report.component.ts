import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { UserSkillPriorityReportsService } from '../user-skill-priority-report/user-skill-priority-reports.service';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';
import { SkillUserView } from '../../skill-users/skill-users.component';

@Component({
  selector: 'app-skill-users-report',
  templateUrl: './skill-users-report.component.html',
  styleUrls: ['./skill-users-report.component.scss']
})
export class SkillUsersReportComponent implements OnInit {

  skillName: string = null;
  skillUsers: SkillUserView[] = [];
  reportId: string = null;
  aggregationReportId: string = null;
  errorMessage: string = null;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private userSkillPriorityReportsService: UserSkillPriorityReportsService,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => ({
        reportId: params.get('reportId'),
        aggregationReportId: params.get('aggregationReportId')
      })))
      .subscribe(params => {
        this.reportId = params.reportId;
        this.aggregationReportId = params.aggregationReportId;
        this.loadSkillUsers();
      });
  }

  private loadSkillUsers() {
    this.userSkillPriorityReportsService.getUserSkillReportsByAggregationReportId(this.reportId, this.aggregationReportId)
      .pipe(tap(userSkillReports => {
        if (userSkillReports.length) { this.skillName = userSkillReports[0].skillName; }
      }))
      .pipe(map(userSkillReports => userSkillReports.map<SkillUserView>(skillUser => ({
        userName: skillUser.userName,
        currentLevel: skillUser.currentLevel,
        desiredLevel: skillUser.desiredLevel,
        priority: skillUser.priority
      }))))
      .subscribe(skillUsers => {
        this.skillUsers = skillUsers.sort((a, b) => {
          if (a.priority !== b.priority) { return b.priority - a.priority; }
          if (a.desiredLevel !== b.desiredLevel) { return b.desiredLevel - a.desiredLevel; }
          if (a.currentLevel !== b.currentLevel) { return b.currentLevel - a.currentLevel; }
          return a.userName.toLocaleLowerCase().localeCompare(b.userName.toLocaleLowerCase());
        });
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  backToReport() {
    this.router.navigate(['../../', { aggregationReportId: this.aggregationReportId }], { relativeTo: this.activatedRoute });
  }

}
