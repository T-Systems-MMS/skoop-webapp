import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { MySkillsService } from './my-skills.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserSkillView } from '../shared/skill-card/user-skill-view';
import { MatSlider, MatSliderChange } from '@angular/material';
import { StepDescription } from './step-description';
import { ExternalAssetsService } from '../shared/external-assets.service';

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

  private levelDescription: StepDescription;

  @ViewChild('currentLevelSlider', { static: true }) currentLevelSlider: MatSlider;
  @ViewChild('desiredLevelSlider', { static: true }) desiredLevelSlider: MatSlider;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public userSkill: UserSkillView,
    private mySkillsService: MySkillsService,
    private externalAssetsService: ExternalAssetsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit() {
    this.externalAssetsService.getJSON<StepDescription>('/assets/config/level-description.json')
      .subscribe(data => {
        this.levelDescription = data;

        this.updateLabel(this.currentLevelSlider, this.levelDescription, this.userSkill.currentLevel);
        this.updateLabel(this.desiredLevelSlider, this.levelDescription, this.userSkill.desiredLevel);
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

    return '0 - ' + this.levelDescription.step0 + '\n' +
      '1 - ' + this.levelDescription.step1 + '\n' +
      '2 - ' + this.levelDescription.step2 + '\n' +
      '3 - ' + this.levelDescription.step3 + '\n' +
      '4 - ' + this.levelDescription.step4;
  }

  onLevelValueChanged(event: MatSliderChange) {
    this.updateLabel(event.source, this.levelDescription, event.value);
  }

  private updateLabel(slider: MatSlider, description: StepDescription, step: number) {
    if (step === null) {
      return;
    }

    const title = description['step' + step];
    slider._elementRef.nativeElement.querySelector('.mat-slider-thumb').setAttribute('title', title);

    const stepLabel = slider._elementRef.nativeElement.querySelector('.mat-slider-thumb-label');
    if (stepLabel) {
      stepLabel.setAttribute('title', title);
    }
  }
}

