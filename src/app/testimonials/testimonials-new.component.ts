import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MatBottomSheetRef} from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TestimonialService } from './testimonial.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Testimonial } from './testimonial';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-testimonials-new',
  templateUrl: './testimonials-new.component.html',
  styleUrls: ['./testimonials-new.component.scss']
})
export class TestimonialsNewComponent implements OnInit {

  testimonialForm: FormGroup;
  errorMessage: string = null;

  constructor(private testimonialService: TestimonialService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheetRef) {
  }

  ngOnInit() {
    this.testimonialForm = this.formBuilder.group({
      author: new FormControl('', Validators.required),
      skills: new FormControl([]),
      comment: new FormControl('', Validators.required)
    });
  }

  addTestimonial() {
    this.testimonialService.createTestimonial(this.getTestimonialData())
      .subscribe((data) => {
        this.testimonialForm.reset();
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private getTestimonialData(): Testimonial {
    return {
      author: this.testimonialForm.get('author').value,
      skills: this.skillsArray || [],
      comment: this.testimonialForm.get('comment').value
    } as Testimonial;
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
