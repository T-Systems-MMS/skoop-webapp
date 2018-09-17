import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MySkillsService } from './my-skills.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-my-skills-new',
  templateUrl: './my-skills-new.component.html',
  styleUrls: ['./my-skills-new.component.scss']
})
export class MySkillsNewComponent implements OnInit, OnDestroy {

  skillName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  currentLevel: FormControl = new FormControl(0);
  desiredLevel: FormControl = new FormControl(0);
  priority: FormControl = new FormControl(0);
  addedSkillsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;
  skillSuggestions$: Observable<string[]>;

  constructor(private mySkillsService: MySkillsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.skillSuggestions$ = this.skillName.valueChanges
      .pipe(switchMap(search => this.mySkillsService.getCurrentUserSkillSuggestions(search)));
    this.skillSuggestions$
      .subscribe(() => { }
        , (errorResponse: HttpErrorResponse) => {
          this.operationInProgress = false;
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss(this.addedSkillsCount > 0);
  }

  addUserSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.mySkillsService.createCurrentUserSkill(
      this.skillName.value, this.currentLevel.value, this.desiredLevel.value, this.priority.value)
      .subscribe(() => {
        this.addedSkillsCount++;
        this.operationInProgress = false;
        this.skillName.reset('');
        this.currentLevel.reset(0);
        this.desiredLevel.reset(0);
        this.priority.reset(0);
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
      this.addUserSkill();
    }
  }
}
