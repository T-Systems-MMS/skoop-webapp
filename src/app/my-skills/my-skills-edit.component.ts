import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { MySkillsService } from './my-skills.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserSkillView } from '../shared/skill-card/user-skill-view';
import { StepDescription } from './step-description';
import { ExternalAssetsService } from '../shared/external-assets.service';
import { MySkillsDialogComponentTrait } from './my-skills-dialog-component-trait';

@Component({
  selector: 'app-my-skills-edit',
  templateUrl: './my-skills-edit.component.html',
  styleUrls: ['./my-skills-edit.component.scss']
})
export class MySkillsEditComponent extends MySkillsDialogComponentTrait implements OnInit {
  currentLevel: FormControl = new FormControl(this.userSkill.currentLevel);
  desiredLevel: FormControl = new FormControl(this.userSkill.desiredLevel);
  priority: FormControl = new FormControl(this.userSkill.priority);
  operationInProgress = false;
  errorMessage: string = null;

  public levelDescription: StepDescription;
  public priorityDescription: StepDescription;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public userSkill: UserSkillView,
    private mySkillsService: MySkillsService,
    private externalAssetsService: ExternalAssetsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
    super();
  }

  ngOnInit() {
    this.externalAssetsService.getJSON<StepDescription>('/assets/config/level-description.json')
      .subscribe(data => {
        this.levelDescription = data;
      });

    this.externalAssetsService.getJSON<StepDescription>('/assets/config/priority-description.json')
      .subscribe(data => {
        this.priorityDescription = data;
      });
  }

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

  getLevelsHint(): string {
    if (!this.levelDescription) {
      return '';
    }

    return this.resolveStepsDescription(this.levelDescription);
  }

  getPriorityHint(): string {
    if (!this.priorityDescription) {
      return '';
    }

    return this.resolveStepsDescription(this.priorityDescription);
  }

}

