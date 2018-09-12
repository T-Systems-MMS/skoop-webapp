import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserSkillPriorityReportsService } from '../../user-skill-priority-reports.service';
import { SkillUserView } from '../../../skill-users/skill-users.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SkillView } from '../../../my-skills/my-skills-edit.component';
import { ResponseError, ResponseSubError } from '../../../error/response-error';
import { GlobalErrorHandlerService } from '../../../error/global-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-skill-users-report',
  templateUrl: './skill-users-report.component.html',
  styleUrls: ['./skill-users-report.component.scss']
})
export class SkillUsersReportComponent implements OnInit {

  skillName: string = null;
  skillUsers: SkillUserView[] = [];
  userSkillPriorityAggregationReportId: String;
  errorMessage: string = null;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private userSkillPriorityReportsService: UserSkillPriorityReportsService,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('userSkillPriorityAggregationReportId')))
      .subscribe(userSkillPriorityAggregationReportId => {
        this.userSkillPriorityAggregationReportId = userSkillPriorityAggregationReportId;
        this.loadSkillName(userSkillPriorityAggregationReportId);
        this.loadSkillUsers(userSkillPriorityAggregationReportId);
      });
  }

  private loadSkillName(userSkillPriorityAggregationReportId: string) {
    this.userSkillPriorityReportsService.getSkillName(userSkillPriorityAggregationReportId)
      .subscribe(skillName => {
        this.skillName = skillName + '';
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  private loadSkillUsers(userSkillPriorityAggregationReportId: string) {
    this.userSkillPriorityReportsService.getUserSkillReportById(userSkillPriorityAggregationReportId)
      .pipe(map(skillUsers => skillUsers.map<SkillUserView>(skillUser => ({
        user: {
          id: skillUser.user.id,
          userName: skillUser.user.userName
        },
        currentLevel: skillUser.currentLevel,
        desiredLevel: skillUser.desiredLevel,
        priority: skillUser.priority
      }))))
      .subscribe(skillUsers => {
        this.skillUsers = skillUsers.sort((a, b) => {
          if (a.priority !== b.priority) { return b.priority - a.priority; }
          if (a.desiredLevel !== b.desiredLevel) { return b.desiredLevel - a.desiredLevel; }
          if (a.currentLevel !== b.currentLevel) { return b.currentLevel - a.currentLevel; }
          return a.user.userName.toLocaleLowerCase().localeCompare(b.user.userName.toLocaleLowerCase());
        });
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  backToSkillPriorityReport() {
    this.router.navigate(['../../', { skillId: this.userSkillPriorityAggregationReportId }], { relativeTo: this.activatedRoute });
  }

}
