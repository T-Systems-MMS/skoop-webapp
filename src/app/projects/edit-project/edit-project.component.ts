import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../projects.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { Project } from '../project';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  projectForm: FormGroup;
  errorMessage: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public project: Project,
              private projectService: ProjectsService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
    this.projectForm = formBuilder.group({
      name: new FormControl(project.name, Validators.required),
      customer: new FormControl(project.customer),
      industrySector: new FormControl(project.industrySector),
      description: new FormControl(project.description)
    });
  }

  ngOnInit() {
  }

  editProject() {
    this.projectService.updateProject(this.getProjectData())
      .pipe(
        finalize(() => {
            this.projectForm.markAsPristine();
          }
        )
      )
      .subscribe(data => {
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private getProjectData(): Project {
    return {
      id: this.project.id,
      name: this.projectForm.get('name').value,
      customer: this.projectForm.get('customer').value,
      industrySector: this.projectForm.get('industrySector').value,
      description: this.projectForm.get('description').value,
    } as Project;
  }

}
