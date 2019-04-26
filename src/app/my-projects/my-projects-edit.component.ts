import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { MyProjectsService } from './my-projects.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { finalize } from 'rxjs/operators';
import { UserProject } from '../user-projects/user-project';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateUserProjectRequest } from '../user-projects/update-user-project-request';
import { Util } from '../util/util';
import { FormsService } from '../shared/forms.service';

@Component({
  selector: 'app-my-projects-edit',
  templateUrl: './my-projects-edit.component.html',
  styleUrls: ['./my-projects-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyProjectsEditComponent implements OnInit {

  errorMessage: string = null;
  formGroup: FormGroup;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public userProject: UserProject,
              private bottomSheet: MatBottomSheetRef,
              private myProjectService: MyProjectsService,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private formsService: FormsService) { }

  ngOnInit() {

    this.formGroup = this.fb.group({
      projectName: [{value: this.userProject.project.name, disabled: true}, Validators.required],
      skills: [(this.userProject.skills || []).map(item => item.name)],
      role: this.userProject.role,
      tasks: this.userProject.tasks,
      startDate: [Util.ignoreTimezone(this.userProject.startDate), Validators.required],
      endDate: Util.ignoreTimezone(this.userProject.endDate)
    },
      {
        validators: [
          this.formsService.validatorFnOf('inconsistent dates', Util.datesAreConsistent)
        ]
      });
  }

  updateUserProject(): void {
    const projectId: string = this.userProject.project.id;
    const request: UpdateUserProjectRequest = {
      role: this.formGroup.controls.role.value,
      skills: this.skillsArray || [],
      tasks: this.formGroup.controls.tasks.value,
      startDate: Util.ignoreTimezone(this.formGroup.controls.startDate.value),
      endDate: Util.ignoreTimezone(this.formGroup.controls.endDate.value)
    };
    this.myProjectService.updateCurrentUserProject(projectId, request)
      .pipe(
        finalize( () => {
            this.formGroup.markAsPristine();
          }
        )
      )
      .subscribe((userProject: UserProject) => {
        this.bottomSheet.dismiss(userProject);
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  close(): void {
    this.bottomSheet.dismiss();
  }

  get skillsArray(): string[] {
    return this.formGroup.get('skills').value;
  }

}
