import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from './communities.service';
import { Observable, of } from 'rxjs';
import { Community } from './community';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunitiesNewComponent } from './communities-new.component';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {

  communities$: Observable<Community[]> = of([]);
  errorMessage: string = null;

  constructor(private communityService: CommunitiesService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog,) {
  }

  ngOnInit() {
    this.loadCommunities();
  }

  openNewDialog(): void {
    this.bottomSheet.open(CommunitiesNewComponent)
      .afterDismissed().subscribe((result) => {
      if (result) {
        this.loadCommunities();
      }
    });
  }

  delete(community: Community): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.communityService.deleteCommunity(community.id)
          .subscribe(() => {
            this.loadCommunities();
          }, (errorResponse: HttpErrorResponse) => {
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
    });
  }

  private loadCommunities() {
    this.communities$ = this.communityService.getCommunities()
      .pipe(
        catchError((err: HttpErrorResponse, caught: Observable<Community[]>) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(err);
          return of([]);
        })
      );
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
