import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatBottomSheetRef, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillGroupsService } from '../skill-groups/skill-groups.service';
import { SkillsService } from './skills.service';

@Component({
  selector: 'app-skills-new',
  templateUrl: './skills-new.component.html',
  styleUrls: ['./skills-new.component.scss']
})
export class SkillsNewComponent implements OnInit, OnDestroy, AfterViewInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedGroups: Set<string> = new Set([]);
  groupSuggestions$: Observable<string[]>;
  groupCtrl = new FormControl();
  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  addedSkillsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;
  skillName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  skillDescription: FormControl = new FormControl('');
  @ViewChild('skillNameInput') skillNameInput: ElementRef<HTMLInputElement>;

  constructor(private skillsService: SkillsService,
    private skillGroupsService: SkillGroupsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.groupSuggestions$ = this.groupCtrl.valueChanges
      .pipe(debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.skillGroupsService.getSkillGroupSuggestions(search)));

    this.skillName.valueChanges
      .pipe(debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.skillsService.isSkillExist(search)))
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

  ngAfterViewInit(): void {
    setTimeout(() => this.skillNameInput.nativeElement.focus(), 0);
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss(this.addedSkillsCount > 0);
  }

  addSkill(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.skillsService.createSkill(this.skillName.value, this.skillDescription.value, this.selectedGroups)
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
    if (event.key === 'Enter' && this.skillName.value.length > 2) {
      this.addSkill();
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
