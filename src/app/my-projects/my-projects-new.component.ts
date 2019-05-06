import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatBottomSheetRef
} from '@angular/material';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/project';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, map, startWith } from 'rxjs/operators';
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
export class MyProjectsNewComponent implements OnInit {

  errorMessage: string = null;
  formGroup: FormGroup;

  @ViewChild(MatAutocompleteTrigger) trigger;

  @ViewChild('projectAutoComplete') projectsMatAutocomplete: MatAutocomplete;
  @ViewChild('projectInput') projectAutocompleteInput: ElementRef<HTMLInputElement>;

  projects$: Observable<Project[]>;
  allAvailableProjects: Project[];

  constructor(private bottomSheet: MatBottomSheetRef,
              private projectsService: ProjectsService,
              private myProjectService: MyProjectsService,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private formsService: FormsService) { }

  ngOnInit() {
    this.loadProjects();
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

    this.projects$ = this.formGroup.controls.projectName.valueChanges.pipe(
      startWith(null),
      map((term: string | null) => term ? this._filter(term) : this.allAvailableProjects));
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  assignUserProject(): void {
    const request: AssignUserProjectRequest = {
      projectName: this.formGroup.controls.projectName.value,
      skills: this.skillsArray || [],
      role: this.formGroup.controls.role.value,
      tasks: this.formGroup.controls.tasks.value,
      startDate: Util.ignoreTimezone(this.formGroup.controls.startDate.value),
      endDate: Util.ignoreTimezone(this.formGroup.controls.endDate.value)
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

  private _filter(value: any): Project[] {
    const filterValue = value.toLowerCase();
    return this.allAvailableProjects.filter(project => project.name.toLowerCase().indexOf(filterValue) != -1);
  }

  private loadProjects() {
    this.projectsService.getProjects().subscribe(projects => {
      this.allAvailableProjects = projects;
    });
  }

  get skillsArray(): string[] {
    return this.formGroup.get('skills').value;
  }

}
