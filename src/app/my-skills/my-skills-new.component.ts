import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { MySkillsService } from './my-skills.service';

@Component({
  selector: 'app-my-skills-new',
  templateUrl: './my-skills-new.component.html',
  styleUrls: ['./my-skills-new.component.scss']
})
export class MySkillsNewComponent implements OnInit {
  skillName: FormControl = new FormControl('');
  currentLevel: FormControl = new FormControl(0);
  desiredLevel: FormControl = new FormControl(0);
  priority: FormControl = new FormControl(0);
  addedSkillsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;
  skillSuggestions$: Observable<string[]>;

  constructor(private mySkillsService: MySkillsService, private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.skillSuggestions$ = this.skillName.valueChanges
      .pipe(switchMap(search => this.mySkillsService.getCurrentUserSkillSuggestions(search)));
  }

  addUserSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = null;
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
      }, (error: HttpErrorResponse) => {
        this.operationInProgress = false;
        this.errorMessage = 'Error: ';
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred.
          this.errorMessage += error.error.message;
          console.error(`Error creating new user skill: ${error.error.message}`);
        } else {
          // A server-side error occurred.
          this.errorMessage += error.error.message;
          console.error(`Error creating new user skill. `
            + `Server returned code ${error.status}, message was: ${error.error.message}`);
        }
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
