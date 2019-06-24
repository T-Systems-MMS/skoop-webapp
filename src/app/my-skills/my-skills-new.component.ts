import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MySkillsService } from './my-skills.service';
import { ExternalAssetsService } from '../shared/external-assets.service';
import { StepDescription } from './step-description';
import { MySkillsDialogComponentTrait } from './my-skills-dialog-component-trait';

@Component({
  selector: 'app-my-skills-new',
  templateUrl: './my-skills-new.component.html',
  styleUrls: ['./my-skills-new.component.scss']
})
export class MySkillsNewComponent extends MySkillsDialogComponentTrait implements OnInit, OnDestroy, AfterViewInit {

  private _savingInProgress: boolean = false;

  skillName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  currentLevel: FormControl = new FormControl(0);
  desiredLevel: FormControl = new FormControl(0);
  priority: FormControl = new FormControl(0);
  addedSkillsCount = 0;
  errorMessage: string = null;
  skillSuggestions$: Observable<string[]>;
  @ViewChild('skillNameInput', { static: true }) skillNameInput: ElementRef<HTMLInputElement>;

  public levelDescription: StepDescription;

  constructor(private mySkillsService: MySkillsService,
    private externalAssetsService: ExternalAssetsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
    super();
  }

  ngOnInit(): void {
    this.skillSuggestions$ = this.skillName.valueChanges
      .pipe(debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.mySkillsService.getCurrentUserSkillSuggestions(search)));
    this.externalAssetsService.getJSON<StepDescription>('/assets/config/level-description.json')
      .subscribe(data => {
        this.levelDescription = data;
      });
  }

  ngAfterViewInit(): void {
    // Defer focusing because mat-autocomplete is still uninitialized in this lifecycle hook.
    setTimeout(() => this.skillNameInput.nativeElement.focus(), 0);
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss(this.addedSkillsCount > 0);
  }

  addUserSkill(): void {
    this.errorMessage = '';
    this.savingInProgress = true;
    this.mySkillsService.createCurrentUserSkill(
      this.skillName.value, this.currentLevel.value, this.desiredLevel.value, this.priority.value
    )
      .pipe(
        finalize( () => {
            this.savingInProgress = false;
          }
        )
      )
      .subscribe(() => {
      this.addedSkillsCount++;
      this.skillName.reset('');
      this.currentLevel.reset(0);
      this.desiredLevel.reset(0);
      this.priority.reset(0);
      this.skillNameInput.nativeElement.focus();
    }, (errorResponse: HttpErrorResponse) => {
      this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
      // Dirty fix because of: https://github.com/angular/angular/issues/17772
      this.changeDetector.markForCheck();
    });
  }

  close(): void {
    this.bottomSheet.dismiss(this.addedSkillsCount > 0);
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.skillName.value.length > 2) {
      this.addUserSkill();
    }
  }

  getLevelsHint(): string {
    if (!this.levelDescription) {
      return '';
    }

    return this.resolveStepsDescription(this.levelDescription);
  }

  get savingInProgress(): boolean {
    return this._savingInProgress;
  }

  set savingInProgress(value: boolean) {
    this._savingInProgress = value;
  }
}
