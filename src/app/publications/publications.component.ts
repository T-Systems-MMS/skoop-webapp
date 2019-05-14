import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { PublicationService } from './publication.service';
import { PublicationsNewComponent } from './publications-new.component';
import { PublicationResponse } from './publication-response';
import { catchError, filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PublicationsEditComponent } from './publications-edit.component';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {

  errorMessage: string = null;
  publications$: Observable<PublicationResponse[]> = of([]);

  constructor(private publicationService: PublicationService,
              public dialog: MatDialog,
              private popupNotificationService: PopupNotificationService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.loadPublications();
  }

  openNewDialog() {
    this.bottomSheet.open(PublicationsNewComponent)
      .afterDismissed().subscribe((publication: PublicationResponse) => {
      if (publication) {
        this.loadPublications();
        this.popupNotificationService.showSuccessMessage('A new publication was created successfully');
      }
    });
  }

  openEditDialog(publication: PublicationResponse) {
    this.bottomSheet.open(PublicationsEditComponent, {
      data: Object.assign({}, publication)
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => {
      this.loadPublications();
      this.popupNotificationService.showSuccessMessage('The publication was updated successfully');
    });
  }

  delete(publication: PublicationResponse) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.publicationService.deletePublication(publication.id)
          .subscribe(() => {
            this.loadPublications();
            this.popupNotificationService.showSuccessMessage('The publication was deleted successfully');
          }, (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          });
      }
    });
  }

  private loadPublications() {
    this.publications$ = this.publicationService.getPublications()
      .pipe(
        catchError((errorResponse: HttpErrorResponse, caught: Observable<PublicationResponse[]>) => {
          this.handleErrorResponse(errorResponse);
          return of([]);
        })
      );
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
