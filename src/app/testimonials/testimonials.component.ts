import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { TestimonialsNewComponent } from './testimonials-new.component';
import { Testimonial } from './testimonial';
import { TestimonialService } from './testimonial.service';
import { Observable, of } from 'rxjs';
import { TestimonialResponse } from './testimonial-response';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, filter } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { TestimonialsEditComponent } from './testimonials-edit.component';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  testimonials$: Observable<TestimonialResponse[]> = of([]);
  errorMessage: string = null;

  constructor(private testimonialService: TestimonialService,
              public dialog: MatDialog,
              private popupNotificationService: PopupNotificationService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.loadTestimonials();
  }

  openNewDialog() {
    this.bottomSheet.open(TestimonialsNewComponent)
      .afterDismissed().subscribe((testimonial: Testimonial) => {
      if (testimonial) {
        this.loadTestimonials();
        this.popupNotificationService.showSuccessMessage('A new testimonial was created successfully');
      }
    });
  }

  openEditDialog(testimonial: TestimonialResponse) {
    this.bottomSheet.open(TestimonialsEditComponent, {
      data: <TestimonialResponse>{
        id: testimonial.id,
        author: testimonial.author,
        comment: testimonial.comment,
        skills: testimonial.skills
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => {
      this.loadTestimonials();
      this.popupNotificationService.showSuccessMessage('The testimonial was updated successfully');
    });
  }

  delete(testimonial: TestimonialResponse) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.testimonialService.deleteTestimonial(testimonial.id)
          .subscribe(() => {
            this.loadTestimonials();
            this.popupNotificationService.showSuccessMessage('The testimonial was deleted successfully');
          }, (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          });
      }
    });
  }

  private loadTestimonials() {
    this.testimonials$ = this.testimonialService.getTestimonials()
      .pipe(
        catchError((errorResponse: HttpErrorResponse, caught: Observable<TestimonialResponse[]>) => {
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
