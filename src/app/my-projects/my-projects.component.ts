import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { MyProjectsService } from './my-projects.service';
import { UserProject } from '../user-projects/user-project';
import { MyProjectsNewComponent } from './my-projects-new.component';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MyProjectsEditComponent } from './my-projects-edit.component';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {

  userProjects: UserProject[] = [];
  errorMessage: string = null;

  constructor(private bottomSheet: MatBottomSheet,
              private myProjectService: MyProjectsService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit() {
    this.loadUserProjects();
  }

  openNewDialog(): void {
    this.bottomSheet.open(MyProjectsNewComponent)
      .afterDismissed().subscribe(() => this.loadUserProjects());
  }

  openEditDialog(userProject: UserProject): void {
    this.bottomSheet.open(MyProjectsEditComponent, {
      data: userProject
    }).afterDismissed().subscribe(() => {
      this.loadUserProjects();
    });
  }

  delete(userProject: UserProject): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.myProjectService.deleteCurrentUserProject(userProject.project.id)
          .subscribe(() => {
            this.loadUserProjects();
          }, (errorResponse: HttpErrorResponse) => {
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
    });
  }

  private loadUserProjects(): void {
    this.myProjectService.getCurrentUserProjects()
      .subscribe((userProjects: UserProject[]) => {
          this.userProjects = userProjects;
        },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }

}
