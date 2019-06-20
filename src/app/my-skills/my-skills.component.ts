import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { filter, map } from 'rxjs/operators';

import { MySkillsNewComponent } from './my-skills-new.component';
import { MySkillsEditComponent} from './my-skills-edit.component';
import { UserSkillView as EditUserSkillView} from '../shared/skill-card/user-skill-view';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MySkillsService } from './my-skills.service';

@Component({
  selector: 'app-my-skills',
  templateUrl: './my-skills.component.html',
  styleUrls: ['./my-skills.component.scss']
})
export class MySkillsComponent implements OnInit {
  userSkills: UserSkillView[] = [];
  errorMessage: string = null;

  constructor(private mySkillsService: MySkillsService,
    private bottomSheet: MatBottomSheet,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUserSkills();
  }

  getCoaches(userSkill: UserSkillView): void {
    this.mySkillsService.getCurrentUserSkillCoaches(userSkill.skill.id)
      .pipe(map(coaches => coaches.map<UserView>(coach => ({
        id: coach.id,
        userName: coach.userName,
        firstName: coach.firstName,
        lastName: coach.lastName
      }))))
      .subscribe(
        (coaches) => { userSkill.coaches = coaches; },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
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
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.mySkillsService.deleteCurrentUserSkill(userSkill.skill.id)
          .subscribe(() => {
            this.loadUserSkills();
          }, (errorResponse: HttpErrorResponse) => {
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
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
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
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
  firstName?: string;
  lastName?: string;
}
