import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { SkillsService } from '../skills/skills.service';
import { UserSkillsService } from '../user-skills/user-skills.service';

@Component({
  selector: 'app-skill-users',
  templateUrl: './skill-users.component.html',
  styleUrls: ['./skill-users.component.scss']
})
export class SkillUsersComponent implements OnInit {
  skill: SkillView = null;
  skillUsers: SkillUserView[] = [];

  constructor(private activatedRoute: ActivatedRoute, private skillsService: SkillsService,
    private userSkillsService: UserSkillsService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('skillId')))
      .subscribe(skillId => {
        this.loadSkill(skillId);
        this.loadSkillUsers(skillId);
      });
  }

  private loadSkill(skillId: string) {
    this.skillsService.getSkill(skillId)
      .pipe(map(skill => (<SkillView>{ id: skill.id, name: skill.name })))
      .subscribe(skill => this.skill = skill);
  }

  private loadSkillUsers(skillId: string) {
    this.userSkillsService.getSkillUsers(skillId, 1)
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
}

interface SkillView {
  id: string;
  name: string;
}

interface SkillUserView {
  user: UserView;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
}

interface UserView {
  id: string;
  userName: string;
}
