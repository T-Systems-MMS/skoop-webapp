import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TestimonialService } from './testimonial.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { TestimonialResponse } from './testimonial-response';
import { TestimonialRequest } from './testimonial-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-testimonials-edit',
  templateUrl: './testimonials-edit.component.html',
  styleUrls: ['./testimonials-edit.component.scss']
})
export class TestimonialsEditComponent implements OnInit {

  testimonialForm: FormGroup;
  errorMessage: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public testimonial: TestimonialResponse,
              private testimonialService: TestimonialService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.testimonialForm = this.formBuilder.group({
      author: new FormControl(this.testimonial.author, Validators.required),
      skills: new FormControl((this.testimonial.skills || []).map(item => item.name)),
      comment: new FormControl(this.testimonial.comment, Validators.required)
    });
  }

  editTestimonial() {
    this.testimonialService.updateTestimonial(this.getTestimonialData())
      .subscribe(data => {
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private getTestimonialData(): TestimonialRequest {
    return {
      id: this.testimonial.id,
      author: this.testimonialForm.get('author').value,
      comment: this.testimonialForm.get('comment').value,
      skills: this.skillsArray || [],
    } as TestimonialRequest;
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  get skillsArray(): string[] {
    return this.testimonialForm.get('skills').value;
  }

}
