import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { switchMap } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillGroupsService } from './skill-groups.service';

@Component({
  selector: 'app-skill-groups-new',
  templateUrl: './skill-groups-new.component.html',
  styleUrls: ['./skill-groups-new.component.scss']
})
export class SkillGroupsNewComponent implements OnInit, OnDestroy, AfterViewInit {
  groupName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  groupDescription: FormControl = new FormControl('');
  @ViewChild('skillGroupNameInput', { static: true }) skillGroupNameInput: ElementRef<HTMLInputElement>;

  addedGroupsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;

  constructor(private skillGroupsService: SkillGroupsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.groupName.valueChanges
      .pipe(switchMap(search => this.skillGroupsService.isSkillGroupExist(search)))
      .subscribe(isSkillGroupExist => {
        if (isSkillGroupExist) {
          this.errorMessage = 'Skill group with this name has already existed!';
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
    setTimeout(() => this.skillGroupNameInput.nativeElement.focus(), 0);
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss(this.addedGroupsCount > 0);
  }

  addGroup(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.skillGroupsService.createSkillGroup(this.groupName.value, this.groupDescription.value)
      .subscribe(() => {
        this.addedGroupsCount++;
        this.operationInProgress = false;
        this.groupName.reset('');
        this.groupDescription.reset('');
        document.querySelector<HTMLElement>('#skoop-new-skill-name').focus();
      }, (errorResponse: HttpErrorResponse) => {
        this.operationInProgress = false;
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  close(): void {
    this.bottomSheet.dismiss(this.addedGroupsCount > 0);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.groupName.value.length > 2) {
      this.addGroup();
    }
  }
}
