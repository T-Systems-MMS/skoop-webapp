import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesEditComponent } from './communities-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { of } from 'rxjs';
import { Community } from './community';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CommunityType } from './community-type.enum';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

const communityEditData = {
  id: '2134-5679-235235',
  title: 'community',
  description: 'community description',
  type: CommunityType.OPENED,
  links: [
    {
      name: 'google',
      href: 'https://www.google.com'
    }
  ]
};

describe('CommunitiesEditComponent', () => {
  let component: CommunitiesEditComponent;
  let fixture: ComponentFixture<CommunitiesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ CommunitiesEditComponent, ClosedCommunityConfirmDialogComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {'updateCommunity': of<Community>() } ) },
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: communityEditData }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ClosedCommunityConfirmDialogComponent]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill in the form with expected values', () => {
    expect(component.communityForm.get('title').value).toBe(communityEditData.title);
    expect(component.communityForm.get('description').value).toBe(communityEditData.description);
    expect(component.communityForm.get('links').value).toEqual(communityEditData.links);
  });

  it('should send a request to update community', () => {
    component.editCommunity();
    const communityService: CommunitiesService = TestBed.get(CommunitiesService);

    expect(communityService.updateCommunity).toHaveBeenCalledWith(communityEditData);
  });

  it('should disable createButton when an added link is not filled', async(() => {
    component.communityForm.reset();
    component.addLink();

    const createButton = fixture.debugElement.query(By.css('#communities-edit-button'));
    expect(createButton.nativeElement.disabled).toBeTruthy();
  }));

  it('should open a confirm dialog when community type was changed to CLOSED', () => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    component.communityForm.get('type').setValue('CLOSED');
    component.editCommunity();

    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(ClosedCommunityConfirmDialogComponent));
  });
});
