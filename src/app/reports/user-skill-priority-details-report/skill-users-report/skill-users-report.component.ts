import { Component, OnInit } from '@angular/core';
import { UserSkillPriorityReportsService } from '../../user-skill-priority-reports.service';
import { SkillUserView } from '../../../skill-users/skill-users.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SkillView } from '../../../my-skills/my-skills-edit.component';

@Component({
  selector: 'app-skill-users-report',
  templateUrl: './skill-users-report.component.html',
  styleUrls: ['./skill-users-report.component.scss']
})
export class SkillUsersReportComponent implements OnInit {

  skill: SkillView = null;
  skillUsers: SkillUserView[] = [];
  userSkillPriorityAggregationReportId: String;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private userSkillPriorityReportsService: UserSkillPriorityReportsService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('userSkillPriorityAggregationReportId')))
      .subscribe(userSkillPriorityAggregationReportId => {
        // this.loadSkill(skillId);
        this.userSkillPriorityAggregationReportId = userSkillPriorityAggregationReportId;
        this.loadSkillUsers(userSkillPriorityAggregationReportId);
      });
  }

  private loadSkill(skillId: string) {
    this.userSkillPriorityReportsService.getSkill(skillId)
      .pipe(map(skill => (<SkillView>{ id: skill.id, name: skill.name })))
      .subscribe(skill => this.skill = skill);
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
      });
  }

  backToSkillPriorityReport() {
    this.router.navigate(['../../', { skillId: this.userSkillPriorityAggregationReportId}], { relativeTo: this.activatedRoute });
  }

}
