import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SkillGroup } from './skill-group';
import { SkillGroupsService } from './skill-groups.service';

@Component({
  selector: 'app-skill-groups-edit',
  templateUrl: './skill-groups-edit.component.html',
  styleUrls: ['./skill-groups-edit.component.scss']
})
export class SkillGroupsEditComponent implements OnInit {

  groupName: FormControl = new FormControl(this.skillGroup.name, [
    Validators.required,
    Validators.minLength(3),
  ]);
  groupDescription: FormControl = new FormControl(this.skillGroup.description);

  addedGroupsCount = 0;
  operationInProgress = false;
  errorMessage: string = null;
  skillNameString: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public skillGroup: SkillGroup,
    private skillGroupsService: SkillGroupsService,
    private bottomSheet: MatBottomSheetRef,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.skillNameString = this.skillGroup.name;
    this.groupName.valueChanges
      .pipe(switchMap(search => this.skillGroupsService.isSkillGroupExist(search)))
      .subscribe(isSkillExist => {
        if (isSkillExist && this.skillNameString !== this.groupName.value) {
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

  editGroup(): void {
    this.operationInProgress = true;
    this.errorMessage = '';
    this.skillGroupsService.updateSkillGroup(this.skillGroup.id, this.groupName.value, this.groupDescription.value)
      .subscribe(() => {
        // Return 'true' to indicate that the skill group was changed.
        this.bottomSheet.dismiss(true);
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
      this.editGroup();
    }
  }

}
