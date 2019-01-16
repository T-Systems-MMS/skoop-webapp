import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ProjectsService } from "../projects.service";
import { Project } from "../project";
import { MatBottomSheetRef } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { GlobalErrorHandlerService } from "../../error/global-error-handler.service";

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {

  projectForm: FormGroup;
  errorMessage: string = null;
  addedProjectsCount = 0;

  constructor(private projectService: ProjectsService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
    this.projectForm = formBuilder.group({
      name: new FormControl(),
      customer: new FormControl(),
      industrySector: new FormControl(),
      description: new FormControl()
    });
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.bottomSheet.dismiss(this.addedProjectsCount > 0);
  }

  createProject() {
    if (!this.projectForm.valid) {
      return;
    }

    this.projectService.createProject(this.getProjectData())
      .subscribe(() => {
        this.addedProjectsCount++;
        this.projectForm.reset();
        document.querySelector<HTMLElement>('#new-project-name').focus();

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

}
