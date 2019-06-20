import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsEditComponent } from './testimonials-edit.component';
import { TestimonialResponse } from './testimonial-response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TestimonialService } from './testimonial.service';
import { of } from 'rxjs';
import { Testimonial } from './testimonial';
import { TestimonialRequest } from './testimonial-request';
import { Component, Input } from '@angular/core';

const testimonialEditData: TestimonialResponse = {
  id: '123123123123',
  author: 'author',
  comment: 'comment',
  skills: [
    {
      id: '1231231',
      name: 'Skill1'
    },
    {
      id: '4325345345',
      name: 'Skill2'
    }
  ]
};

const updatedTestimonial: TestimonialResponse = {
  id: testimonialEditData.id,
  author: 'updated author',
  comment: 'updated comment',
  skills: [
    {
      id: '1231231',
      name: 'Skill1'
    }
  ]
};

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('TestimonialsEditComponent', () => {
  let component: TestimonialsEditComponent;
  let fixture: ComponentFixture<TestimonialsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ TestimonialsEditComponent, SkillSelectInputStubComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: MatBottomSheetRef,
          useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])
        },
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: testimonialEditData
        },
        {
          provide: TestimonialService,
          useValue: jasmine.createSpyObj('testimonialService', {'updateTestimonial': of<Testimonial>(updatedTestimonial)})
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill in the form with expected values', () => {
    expect(component.testimonialForm.get('author').value).toBe(testimonialEditData.author);
    expect(component.testimonialForm.get('comment').value).toBe(testimonialEditData.comment);
    expect(component.testimonialForm.get('skills').value).toEqual(testimonialEditData.skills.map(item => item.name));
  });

  it('should send a request to update a testimonial', () => {
    const testimonialEditRequest: TestimonialRequest = {
      id: updatedTestimonial.id,
      author: updatedTestimonial.author,
      comment: updatedTestimonial.comment,
      skills: ['Skill1']
    };

    component.testimonialForm.get('author').setValue(testimonialEditRequest.author);
    component.testimonialForm.get('comment').setValue(testimonialEditRequest.comment);
    component.testimonialForm.get('skills').setValue(testimonialEditRequest.skills);

    component.editTestimonial();
    const testimonialService: TestimonialService = TestBed.get(TestimonialService);

    expect(testimonialService.updateTestimonial).toHaveBeenCalledWith(testimonialEditRequest);
  });
});
