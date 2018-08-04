import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { MySkillsService } from './my-skills.service';
import { MySkillsNewComponent } from './my-skills-new.component';
import { MySkillsEditComponent, UserSkillView as EditUserSkillView } from './my-skills-edit.component';

@Component({
  selector: 'app-my-skills',
  templateUrl: './my-skills.component.html',
  styleUrls: ['./my-skills.component.scss']
})
export class MySkillsComponent implements OnInit {
  userSkills: UserSkillView[] = [];
  errorMessage: string = null;

  constructor(private mySkillsService: MySkillsService, private bottomSheet: MatBottomSheet,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadUserSkills();
  }

  getCoaches(userSkill: UserSkillView): void {
    this.mySkillsService.getCurrentUserSkillCoaches(userSkill.skill.id)
      .pipe(map(coaches => coaches.map<UserView>(coach => ({
        id: coach.id,
        userName: coach.userName
      }))))
      .subscribe(coaches => userSkill.coaches = coaches);
  }

  openNewDialog(): void {
    this.bottomSheet.open(MySkillsNewComponent)
      .afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadUserSkills());
  }

  openEditDialog(userSkill: UserSkillView): void {
    this.bottomSheet.open(MySkillsEditComponent, {
      data: <EditUserSkillView>{
        skill: {
          id: userSkill.skill.id,
          name: userSkill.skill.name
        },
        currentLevel: userSkill.currentLevel,
        desiredLevel: userSkill.desiredLevel,
        priority: userSkill.priority
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadUserSkills());
  }

  delete(userSkill: UserSkillView): void {
    this.mySkillsService.deleteCurrentUserSkill(userSkill.skill.id)
      .subscribe(() => {
        this.loadUserSkills();
      }, (error: HttpErrorResponse) => {
        this.errorMessage = 'Error: ';
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred.
          this.errorMessage += error.error.message;
          console.error(`Error deleting user skill: ${error.error.message}`);
        } else {
          // A server-side error occurred.
          this.errorMessage += error.error.message;
          console.error(`Error deleting user skill. `
            + `Server returned code ${error.status}, message was: ${error.error.message}`);
        }
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  private loadUserSkills(): void {
    this.mySkillsService.getCurrentUserSkills()
      .pipe(map(userSkills => userSkills.map<UserSkillView>(userSkill => ({
        skill: {
          id: userSkill.skill.id,
          name: userSkill.skill.name
        },
        currentLevel: userSkill.currentLevel,
        desiredLevel: userSkill.desiredLevel,
        priority: userSkill.priority
      }))))
      .subscribe(userSkills => {
        this.userSkills = userSkills.sort((a, b) => {
          if (a.priority !== b.priority) { return b.priority - a.priority; }
          if (a.desiredLevel !== b.desiredLevel) { return b.desiredLevel - a.desiredLevel; }
          if (a.currentLevel !== b.currentLevel) { return b.currentLevel - a.currentLevel; }
          return a.skill.name.toLocaleLowerCase().localeCompare(b.skill.name.toLocaleLowerCase());
        });
      });
  }
}

interface UserSkillView {
  skill: SkillView;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
  coaches?: UserView[];
}

interface SkillView {
  id: string;
  name: string;
}

interface UserView {
  id: string;
  userName: string;
}
