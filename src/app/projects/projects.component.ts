import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "./projects.service";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { NewProjectComponent } from "./new-project/new-project.component";
import { Project } from "./project";
import { DeleteConfirmationDialogComponent } from "../shared/delete-confirmation-dialog/delete-confirmation-dialog.component";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: Project[] = [];

  constructor(private projectService: ProjectsService,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadProjects();
  }

  openProjectDialog() {
    this.bottomSheet.open(NewProjectComponent)
  }

  loadProjects() {
    this.projectService.getProjects()
      .subscribe(projects => {
          this.projects = projects;
        },
        err => {

        })
  }

  openEditDialog(project: Project) {

  }

  delete(skill: Project): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(skill.id)
          .subscribe(() => {
            this.loadProjects();
          }, (errorResponse: HttpErrorResponse) => {
            // this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // // Dirty fix because of: https://github.com/angular/angular/issues/17772
            // this.changeDetector.markForCheck();
          });
      }
    });
  }

}
