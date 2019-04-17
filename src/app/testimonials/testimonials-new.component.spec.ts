import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsNewComponent } from './testimonials-new.component';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './testimonial';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { MatBottomSheetRef } from '@angular/material';

const testimonial: Testimonial = {
  id: '123123123123123',
  author: 'author of the testimonial',
  comment: 'comment of the testimonial',
  skills: ['Skill1', 'Skill2']
};

const skills = [
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    name: 'Angular',
    description: 'JavaScript Framework'
  },
  {
    id: 'c9b80869-c6bd-327d-u9ce-ye0d66b17129',
    name: 'Spring Boot',
    description: 'A Java Framework'
  }
];

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
      declarations: [TestimonialsNewComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: TestimonialService,
          useValue: jasmine.createSpyObj('testimonialService', {'addTestimonial': of<Testimonial>(testimonial)})
        },
        {
          provide: SkillsService,
          useValue: jasmine.createSpyObj('skillsService', {'getAllSkills': of<Skill[]>(skills)})
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
});
