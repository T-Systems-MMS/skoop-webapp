import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SkillsService } from './skills.service';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Skill } from './skill';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss']
})
export class SkillsEditComponent implements OnInit {

  skillName: FormControl = new FormControl(this.skill.name, [
    Validators.required,
    Validators.minLength(3),
  ]);
  skillDescription: FormControl = new FormControl(this.skill.description);

  addedSkillsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;
  skillNameString: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public skill: Skill,
    private skillsService: SkillsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.skillNameString = this.skill.name;
    this.skillName.valueChanges
      .pipe(switchMap(search => this.skillsService.isSkillExist(search)))
      .subscribe(isSkillExist => {
        if (isSkillExist && this.skillNameString !== this.skillName.value) {
          this.errorMessage = 'Skill with this name has already existed!';
          this.operationInProgress = true;
        } else {
          this.errorMessage = '';
          this.operationInProgress = false;
        }
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      }, (errorResponse: HttpErrorResponse) => {
        this.operationInProgress = false;
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  editSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.skillsService.updateSkill(this.skill.id, this.skillName.value, this.skillDescription.value)
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
    this.bottomSheet.dismiss(this.addedSkillsCount > 0);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.skillName.value.length > 2) {
      this.editSkill();
    }
  }

}
