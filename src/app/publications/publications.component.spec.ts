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
import { MatBottomSheet, MatDialog } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PublicationsEditComponent } from './publications-edit.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { of } from 'rxjs';
import { PublicationResponse } from './publication-response';
import { By } from '@angular/platform-browser';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const publications: PublicationResponse[] = [
  {
    id: '18a30b9b-7d0d-4e50-a953-c643e085e071',
    title: 'sdfsdf',
    date: null,
    publisher: 'customer',
    'skills': []
  },
  {
    id: '369710e0-5808-4318-961e-0161f9f81f1c',
    title: 'withot',
    date: new Date(),
    publisher: 'adsad',
    link: '',
    skills: [
      {
        id: '1f5082a3-f7cf-4d6b-ad41-df8bce06e03f',
        name: 'Java',
        description: 'Java programming language.',
        skillGroups: null
      }
    ]
  }
];

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
      declarations: [
        PublicationsComponent,
        SkillSelectInputStubComponent,
        PublicationsNewComponent,
        PublicationsEditComponent,
        DeleteConfirmationDialogComponent ],
      providers: [ GlobalErrorHandlerService,
        {
          provide: PublicationService,
          useValue: jasmine.createSpyObj('publicationService', {'getPublications': of(publications)})
        },
        {
          provide: PopupNotificationService,
          useValue: jasmine.createSpyObj('popupNotificationService', {'showSuccessMessage': of<void>()})
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

  it('should load list of publications', () => {
    const publicationCards = fixture.debugElement.queryAll(By.css(('.publications-card')));

    expect(publicationCards.length).toBe(2);
  });

  it('should open confirmation dialog before removal of a publication', async(() => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    component.delete(publications[0]);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
  }));

  it('should open edit publication dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openEditDialog(publications[0]);

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(PublicationsEditComponent));
    m._openedBottomSheetRef.dismiss();
  }));

  it('should open new publication dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openNewDialog();

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(PublicationsNewComponent));
    m._openedBottomSheetRef.dismiss();
  }));
});
