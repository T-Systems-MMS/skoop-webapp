import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CommunitiesEditComponent } from './communities-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { of } from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { CommunityType } from './community-type.enum';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CommunityResponse } from './community-response';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CommunityRequest } from './community-request';
import { Component, Input } from '@angular/core';

const communityEditData = {
  id: '2134-5679-235235',
  title: 'community',
  description: 'community description',
  type: CommunityType.OPEN,
  skills: [],
  links: [
    {
      id: '12343',
      name: 'google',
      href: 'https://www.google.com'
    }
  ],
  managers: [{id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'}]
} as CommunityResponse;

const communityEditRequest = {
  id: communityEditData.id,
  title: communityEditData.title,
  description: communityEditData.description,
  type: communityEditData.type,
  skillNames: [],
  links: communityEditData.links
} as CommunityRequest;

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('CommunitiesEditComponent', () => {
  let component: CommunitiesEditComponent;
  let fixture: ComponentFixture<CommunitiesEditComponent>;
  // to test autocomplete features
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [CommunitiesEditComponent, ClosedCommunityConfirmDialogComponent, SkillSelectInputStubComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: CommunitiesService,
          useValue: jasmine.createSpyObj('communityService', {'updateCommunity': of<CommunityResponse>()})
        },
        {provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])},
        {provide: MAT_BOTTOM_SHEET_DATA, useValue: communityEditData}
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ClosedCommunityConfirmDialogComponent]
        }
      })
      .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
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

    expect(communityService.updateCommunity).toHaveBeenCalledWith(communityEditRequest);
  });

  it('should send a request to update community with new link', () => {
    const expectedRequest = Object.assign({}, communityEditRequest);
    expectedRequest.links[1] = {
      id: null,
      name: 'new link',
      href: 'https://wwww.new-link.com'
    };
    component.addLink();
    fixture.detectChanges();

    const linkCards = fixture.debugElement.queryAll(By.css(('.communities-link-card')));
    const inputs = linkCards[1].queryAll(By.css(('input')));

    // fill new link
    inputs[0].nativeElement.value = expectedRequest.links[1].name;
    inputs[0].nativeElement.dispatchEvent(new Event('input'));
    inputs[1].nativeElement.value = expectedRequest.links[1].href;
    inputs[1].nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component.editCommunity();
    const communityService: CommunitiesService = TestBed.get(CommunitiesService);

    expect(communityService.updateCommunity).toHaveBeenCalledWith(expectedRequest);
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
