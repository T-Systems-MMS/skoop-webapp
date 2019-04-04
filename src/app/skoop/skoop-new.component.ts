import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkoopService } from './skoop.service';

@Component({
  selector: 'app-skoop-new',
  templateUrl: './skoop-new.component.html',
  styleUrls: ['./skoop-new.component.scss']
})
export class SkoopNewComponent implements OnInit, OnDestroy, AfterViewInit {

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
  @ViewChild('skillNameInput') skillNameInput: ElementRef<HTMLInputElement>;

  constructor(private skoopService: SkoopService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.skillSuggestions$ = this.skillName.valueChanges
      .pipe(debounceTime(500),
        distinctUntilChanged(),
        switchMap(search => this.skoopService.getCurrentUserSkillSuggestions(search)));
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
    this.skoopService.createCurrentUserSkill(
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

  get savingInProgress(): boolean {
    return this._savingInProgress;
  }

  set savingInProgress(value: boolean) {
    this._savingInProgress = value;
  }
}
