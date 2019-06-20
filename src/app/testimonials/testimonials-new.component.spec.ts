import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsNewComponent } from './testimonials-new.component';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Component, Input } from '@angular/core';
import { TestimonialRequest } from './testimonial-request';

const testimonial: TestimonialRequest = {
  id: '123123123123123',
  author: 'author of the testimonial',
  comment: 'comment of the testimonial',
  skills: ['Skill1', 'Skill2']
};

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('TestimonialsNewComponent', () => {
  let component: TestimonialsNewComponent;
  let fixture: ComponentFixture<TestimonialsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [TestimonialsNewComponent, SkillSelectInputStubComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: TestimonialService,
          useValue: jasmine.createSpyObj('testimonialService', {'createTestimonial': of<Testimonial>(testimonial)})
        },
        {
          provide: MatBottomSheetRef,
          useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createTestimonial method', async(() => {
    component.testimonialForm.get('author').setValue(testimonial.author);
    component.testimonialForm.get('comment').setValue(testimonial.comment);
    component.testimonialForm.get('skills').setValue(testimonial.skills);

    component.addTestimonial();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const expectedRequest = {
        author: testimonial.author,
        comment: testimonial.comment,
        skills: testimonial.skills
      };

      const testimonialService = TestBed.get(TestimonialService) as TestimonialService;

      expect(testimonialService.createTestimonial).toHaveBeenCalledWith(expectedRequest);
    });
  }));
});
