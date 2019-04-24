import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteTrigger, MatBottomSheetRef } from '@angular/material';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/project';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MyProjectsService } from './my-projects.service';
import { AssignUserProjectRequest } from '../user-projects/assign-user-project-request';
import { UserProject } from '../user-projects/user-project';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Util } from '../util/util';
import { FormsService } from '../shared/forms.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-projects-new',
  templateUrl: './my-projects-new.component.html',
  styleUrls: ['./my-projects-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyProjectsNewComponent implements OnInit, AfterViewInit {

  errorMessage: string = null;
  formGroup: FormGroup;

  @ViewChild(MatAutocompleteTrigger) trigger;

  projects$: Observable<Project[]>;

  constructor(private bottomSheet: MatBottomSheetRef,
              private projectsService: ProjectsService,
              private myProjectService: MyProjectsService,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private formsService: FormsService) { }

  ngOnInit() {

    this.formGroup = this.fb.group({
      projectName: ['', Validators.required],
      skills: [[]],
      role: '',
      tasks: '',
      startDate: ['', Validators.required],
      endDate: ''
    },
      {
        validators: [
          this.formsService.validatorFnOf('inconsistent dates', Util.datesAreConsistent)
        ]
      });

    this.projects$ = this.projectsService.getProjects();
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  ngAfterViewInit() {
    // clear project name autocomplete when project name is not from a loaded list
    this.trigger.panelClosingActions
      .subscribe(e => {
        if (!(e && e.source)) {
          this.formGroup.controls.projectName.setValue(null);
          this.trigger.closePanel();
        }
      });
  }

  assignUserProject(): void {
    const request: AssignUserProjectRequest = {
      projectId: this.formGroup.controls.projectName.value ? this.formGroup.controls.projectName.value.id : null,
      skills: this.skillsArray || [],
      role: this.formGroup.controls.role.value,
      tasks: this.formGroup.controls.tasks.value,
      startDate: this.formGroup.controls.startDate.value,
      endDate: this.formGroup.controls.endDate.value
    };
    this.myProjectService.assignProjectToCurrentUser(request)
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

  getProjectName(project?: any): string | undefined {
    return project ? project.name : undefined;
  }

  get skillsArray(): string[] {
    return this.formGroup.get('skills').value;
  }

}
