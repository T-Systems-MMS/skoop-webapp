import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsComponent } from './testimonials.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { TestimonialService } from './testimonial.service';
import { TestimonialResponse } from './testimonial-response';
import { of } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TestimonialsEditComponent } from './testimonials-edit.component';
import { TestimonialsNewComponent } from './testimonials-new.component';
import { Component, Input } from '@angular/core';
import { PopupNotificationService } from '../shared/popup-notification.service';

const testimonialsResponse: TestimonialResponse[] = [
  {
    id: '123123123123123',
    author: 'Author 1',
    comment: 'Comment 1',
    skills: [
      {
        id: '1231231',
        name: 'Skill1'
      },
      {
        id: '4325345345',
        name: 'Skill2'
      },
    ]
  },
  {
    id: '42342352452312434532',
    author: 'Author 2',
    comment: 'Comment 2',
    skills: [
      {
        id: '1231231',
        name: 'Skill1'
      },
      {
        id: '4325345345',
        name: 'Skill2'
      },
    ]
  }
];

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('TestimonialsComponent', () => {
  let component: TestimonialsComponent;
  let fixture: ComponentFixture<TestimonialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ TestimonialsComponent, DeleteConfirmationDialogComponent, TestimonialsEditComponent, TestimonialsNewComponent, SkillSelectInputStubComponent ],
      providers: [ GlobalErrorHandlerService,
        {
          provide: TestimonialService,
          useValue: jasmine.createSpyObj('testimonialService', {'getTestimonials': of(testimonialsResponse)})
        },
        {
          provide: PopupNotificationService,
          useValue: jasmine.createSpyObj('popupNotificationService', {'showSuccessMessage': of<void>()})
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [DeleteConfirmationDialogComponent, TestimonialsEditComponent, TestimonialsNewComponent]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load list of testimonials', () => {
    const testimonialsCards = fixture.debugElement.queryAll(By.css(('.testimonials-card')));

    expect(testimonialsCards.length).toBe(2);
  });

  it('should open confirmation dialog before removal of a testimonial', async(() => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    component.delete(testimonialsResponse[0]);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
  }));

  it('should open edit testimonial dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openEditDialog(testimonialsResponse[0]);

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(TestimonialsEditComponent));
    m._openedBottomSheetRef.dismiss();
  }));

  it('should open new testimonial dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openNewDialog();

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(TestimonialsNewComponent));
    m._openedBottomSheetRef.dismiss();
  }));
});
