import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsComponent } from './publications.component';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from '../app-material.module';
import { PublicationsNewComponent } from './publications-new.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { PublicationService } from './publication.service';
import { MatBottomSheet } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PublicationsEditComponent } from './publications-edit.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('PublicationsComponent', () => {
  let component: PublicationsComponent;
  let fixture: ComponentFixture<PublicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatMomentDateModule,
        AppMaterialModule
      ],
      declarations: [ PublicationsComponent, SkillSelectInputStubComponent, PublicationsNewComponent, PublicationsEditComponent ],
      providers: [ GlobalErrorHandlerService,
        {
          provide: PublicationService,
          useValue: jasmine.createSpyObj('publicationService', {})
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [DeleteConfirmationDialogComponent, PublicationsEditComponent, PublicationsNewComponent]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open new publication dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openNewDialog();

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(PublicationsNewComponent));
    m._openedBottomSheetRef.dismiss();
  }));
});
