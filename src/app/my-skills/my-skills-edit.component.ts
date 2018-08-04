import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { MySkillsService } from './my-skills.service';

@Component({
  selector: 'app-my-skills-edit',
  templateUrl: './my-skills-edit.component.html',
  styleUrls: ['./my-skills-edit.component.scss']
})
export class MySkillsEditComponent implements OnInit {
  currentLevel: FormControl = new FormControl(this.userSkill.currentLevel);
  desiredLevel: FormControl = new FormControl(this.userSkill.desiredLevel);
  priority: FormControl = new FormControl(this.userSkill.priority);
  operationInProgress = false;
  errorMessage: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public userSkill: UserSkillView, private mySkillsService: MySkillsService,
    private bottomSheet: MatBottomSheetRef, private changeDetector: ChangeDetectorRef) { }

  ngOnInit() { }

  saveUserSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = null;
    this.mySkillsService.updateCurrentUserSkill(
      this.userSkill.skill.id, this.currentLevel.value, this.desiredLevel.value, this.priority.value)
      .subscribe(() => {
        // Return 'true' to indicate that the user skill was changed.
        this.bottomSheet.dismiss(true);
      }, (error: HttpErrorResponse) => {
        this.operationInProgress = false;
        this.errorMessage = 'Error: ';
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred.
          this.errorMessage += error.error.message;
          console.error(`Error updating user skill: ${error.error.message}`);
        } else {
          // A server-side error occurred.
          this.errorMessage += error.error.message;
          console.error(`Error updating user skill. `
            + `Server returned code ${error.status}, message was: ${error.error.message}`);
        }
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  close(): void {
    // Return nothing to indicate that the user skill was not changed.
    this.bottomSheet.dismiss();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveUserSkill();
    }
  }
}

export interface UserSkillView {
  skill: SkillView;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
}

export interface SkillView {
  id: string;
  name: string;
}
