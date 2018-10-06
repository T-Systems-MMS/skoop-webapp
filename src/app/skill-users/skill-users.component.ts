import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { SkillUsersService } from './skill-users.service';
import { SkillUserView } from './skill-user.component';

@Component({
  selector: 'app-skill-users',
  templateUrl: './skill-users.component.html',
  styleUrls: ['./skill-users.component.scss']
})
export class SkillUsersComponent implements OnInit {
  skill: Skill = null;
  skillUsers: SkillUserView[] = [];
  errorMessage: string = null;

  constructor(private activatedRoute: ActivatedRoute, private skillsService: SkillsService,
    private skillUsersService: SkillUsersService,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('skillId')))
      .subscribe(skillId => {
        this.loadSkill(skillId);
        this.loadSkillUsers(skillId);
      });
  }

  private loadSkill(skillId: string) {
    this.skillsService.getSkill(skillId).subscribe(
      (skill) => { this.skill = skill; },
      (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  private loadSkillUsers(skillId: string) {
    this.skillUsersService.getSkillUsers(skillId, 1)
      .pipe(map(skillUsers => skillUsers.map<SkillUserView>(skillUser => ({
        user: {
          userName: skillUser.user.userName,
          firstName: skillUser.user.firstName,
          lastName: skillUser.user.lastName
        },
        currentLevel: skillUser.currentLevel,
        desiredLevel: skillUser.desiredLevel,
        priority: skillUser.priority
      }))))
      .subscribe(
        (skillUsers) => {
          this.skillUsers = skillUsers.sort((a, b) => {
            if (a.priority !== b.priority) { return b.priority - a.priority; }
            if (a.desiredLevel !== b.desiredLevel) { return b.desiredLevel - a.desiredLevel; }
            if (a.currentLevel !== b.currentLevel) { return b.currentLevel - a.currentLevel; }
            return a.user.userName.toLocaleLowerCase().localeCompare(b.user.userName.toLocaleLowerCase());
          });
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }
}
