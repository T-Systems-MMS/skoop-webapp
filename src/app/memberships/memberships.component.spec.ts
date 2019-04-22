import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsComponent } from './memberships.component';
import { MembershipResponse } from './membership-response';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AppMaterialModule } from '../app-material.module';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { MembershipsNewComponent } from './memberships-new.component';
import { MembershipsEditComponent } from './memberships-edit.component';
import { MembershipService } from './membership.service';
import { By } from '@angular/platform-browser';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const membershipResponses: MembershipResponse[] = [
  {
    id: '18a30b9b-7d0d-4e50-a953-c643e085e071',
    name: 'Membership name',
    description: 'Additional Information',
    link: 'https://www.google.com',
    'skills': []
  },
  {
    id: '369710e0-5808-4318-961e-0161f9f81f1c',
    name: 'Updated name',
    description: 'Updated Additional Information',
    link: null,
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

describe('MembershipsComponent', () => {
  let component: MembershipsComponent;
  let fixture: ComponentFixture<MembershipsComponent>;

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
      declarations: [MembershipsComponent,
        SkillSelectInputStubComponent,
        MembershipsNewComponent,
        MembershipsEditComponent,
        DeleteConfirmationDialogComponent],
      providers: [GlobalErrorHandlerService,
        {
          provide: MembershipService,
          useValue: jasmine.createSpyObj('membershipService', {'getMemberships': of(membershipResponses)})
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [DeleteConfirmationDialogComponent, MembershipsEditComponent, MembershipsNewComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load list of memberships', () => {
    const membershipCards = fixture.debugElement.queryAll(By.css(('.memberships-card')));

    expect(membershipCards.length).toBe(2);
  });

  it('should open confirmation dialog before removal of a membership', async(() => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    component.delete(membershipResponses[0]);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
  }));

  it('should open edit membership dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openEditDialog(membershipResponses[0]);

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(MembershipsEditComponent));
    m._openedBottomSheetRef.dismiss();
  }));

  it('should open new membership dialog', async(() => {
    const m: MatBottomSheet = TestBed.get(MatBottomSheet);

    component.openNewDialog();

    expect(m._openedBottomSheetRef).toBeDefined();
    expect(m._openedBottomSheetRef.instance).toEqual(jasmine.any(MembershipsNewComponent));
    m._openedBottomSheetRef.dismiss();
  }));
});
