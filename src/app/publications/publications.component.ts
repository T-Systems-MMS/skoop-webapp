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
      }
    });
  }

  openEditDialog(publication: PublicationResponse) {
    this.bottomSheet.open(PublicationsEditComponent, {
      data: <PublicationResponse>{
        id: publication.id,
        title: publication.title,
        date: publication.date,
        publisher: publication.publisher,
        link: publication.link,
        skills: publication.skills
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadPublications());
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
