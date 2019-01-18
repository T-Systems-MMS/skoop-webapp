import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectsService } from './projects.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ProjectsNewComponent } from './projects-new.component';
import { Project } from './project';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { ProjectsEditComponent } from './projects-edit.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];
  errorMessage: string = null;
  filter: FormControl = new FormControl('');

  constructor(private projectService: ProjectsService,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects()
      .subscribe(projects => {
          this.projects = projects;
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }

  openProjectDialog() {
    this.bottomSheet.open(ProjectsNewComponent)
      .afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadProjects());
  }

  openEditDialog(project: Project) {
    this.bottomSheet.open(ProjectsEditComponent, {
      data: <Project>{
        id: project.id,
        name: project.name,
        customer: project.customer,
        industrySector: project.industrySector,
        description: project.description
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadProjects());
  }

  delete(project: Project): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(newProjectsWereAdded => {
      if (newProjectsWereAdded) {
        this.projectService.deleteProject(project.id)
          .subscribe(() => {
            this.loadProjects();
          }, (errorResponse: HttpErrorResponse) => {
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
    });
  }

}
