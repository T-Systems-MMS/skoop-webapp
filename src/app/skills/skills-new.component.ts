import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SkillsService } from './skills.service';
import { MatBottomSheetRef } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-skills-new',
  templateUrl: './skills-new.component.html',
  styleUrls: ['./skills-new.component.scss']
})
export class SkillsNewComponent implements OnInit {

  skillName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  skillDescription: FormControl = new FormControl('');

  addedSkillsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;

  constructor(private skillsService: SkillsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.skillName.valueChanges
      .pipe(switchMap(search => this.skillsService.isSkillExist(search)))
      .subscribe(isSkillExist => {
        if (isSkillExist) {
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

  addSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.skillsService.createSkill(this.skillName.value, this.skillDescription.value)
      .subscribe(() => {
        this.addedSkillsCount++;
        this.operationInProgress = false;
        this.skillName.reset('');
        this.skillDescription.reset('');
        document.querySelector<HTMLElement>('#my-skills-new-skill-name').focus();
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
    if (event.key === 'Enter') {
      this.addSkill();
    }
  }

}
