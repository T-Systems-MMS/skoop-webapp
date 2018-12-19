import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatBottomSheetRef, MatChipInputEvent, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillGroupsService } from '../skill-groups/skill-groups.service';
import { Skill } from './skill';
import { SkillsService } from './skills.service';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss']
})
export class SkillsEditComponent implements OnInit, AfterViewInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedGroups: Set<string> = new Set([]);
  groupSuggestions$: Observable<string[]>;
  groupCtrl = new FormControl(this.skill.skillGroups);
  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  addedSkillsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;
  skillNameString: string = null;
  skillName: FormControl = new FormControl(this.skill.name, [
    Validators.required,
    Validators.minLength(3),
  ]);
  skillDescription: FormControl = new FormControl(this.skill.description);
  @ViewChild('skillNameInput') skillNameInput: ElementRef<HTMLInputElement>;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public skill: Skill,
    private skillsService: SkillsService,
    private skillGroupsService: SkillGroupsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.groupSuggestions$ = this.groupCtrl.valueChanges
      .pipe(switchMap(search => this.skillGroupsService.getSkillGroupSuggestions(search)));
    this.selectedGroups = new Set(this.skill.skillGroups);
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

  ngAfterViewInit(): void {
    setTimeout(() => this.skillNameInput.nativeElement.focus(), 0);
  }

  editSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.skillsService.updateSkill(this.skill.id, this.skillName.value, this.skillDescription.value, this.selectedGroups)
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

  // ********************************************
  // ********************************************
  // All below methods are for group autocomplete
  // ********************************************
  // ********************************************

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our group to skill
    if ((value || '').trim()) {
      this.selectedGroups.add(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.groupCtrl.setValue(null);
  }

  remove(group: string): void {
    this.selectedGroups.delete(group);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedGroups.add(event.option.viewValue);
    this.groupInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
  }
}
