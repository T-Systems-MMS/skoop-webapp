import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from './projects.service';
import { Project } from './project';
import { MatBottomSheetRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-projects-new',
  templateUrl: './projects-new.component.html',
  styleUrls: ['./projects-new.component.scss']
})
export class ProjectsNewComponent implements OnInit, OnDestroy {

  private _savingInProgress: boolean = false;

  projectForm: FormGroup;
  errorMessage: string = null;
  addedProjectsCount = 0;

  constructor(private projectService: ProjectsService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {

  }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      customer: new FormControl(),
      industrySector: new FormControl(),
      description: new FormControl()
    });
  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss(this.addedProjectsCount > 0);
  }

  createProject() {
    this.savingInProgress = true;
    this.projectService.createProject(this.getProjectData())
      .pipe(
        finalize( () => {
            console.log('asdasd')
            this.savingInProgress = false;
          }
        )
      )
      .subscribe(() => {
        this.addedProjectsCount++;
        this.projectForm.reset();
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();

      });
  }

  close() {
    this.bottomSheet.dismiss(this.addedProjectsCount > 0);
  }

  private getProjectData(): Project {
    return {
      name: this.projectForm.get('name').value,
      customer: this.projectForm.get('customer').value,
      industrySector: this.projectForm.get('industrySector').value,
      description: this.projectForm.get('description').value,
    } as Project;
  }

  get savingInProgress(): boolean {
    return this._savingInProgress;
  }

  set savingInProgress(value: boolean) {
    this._savingInProgress = value;
  }

}
