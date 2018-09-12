import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { MySkillsService } from './my-skills.service';
import { ResponseError } from '../error/response-error';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

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

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public userSkill: UserSkillView,
    private mySkillsService: MySkillsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit() { }

  saveUserSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = null;
    this.mySkillsService.updateCurrentUserSkill(
      this.userSkill.skill.id, this.currentLevel.value, this.desiredLevel.value, this.priority.value)
      .subscribe(() => {
        // Return 'true' to indicate that the user skill was changed.
        this.bottomSheet.dismiss(true);
      }, (errorResponse: HttpErrorResponse) => {
        this.operationInProgress = false;
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
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
