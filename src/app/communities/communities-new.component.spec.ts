import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CommunitiesNewComponent } from './communities-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { CommunitiesService } from './communities.service';
import { By } from '@angular/platform-browser';
import { CommunityType } from './community-type.enum';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { CommunityRequest } from './community-request';
import { CommunityResponse } from './community-response';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { Component, Input } from '@angular/core';

const user: User = {
  id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
  userName: 'testing',
  firstName: 'Tina',
  lastName: 'Testing',
  email: 'tina.testing@skoop.io'
};

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

describe('CommunitiesNewComponent', () => {
  let component: CommunitiesNewComponent;
  let fixture: ComponentFixture<CommunitiesNewComponent>;
  let communityService: CommunitiesService;
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
      declarations: [CommunitiesNewComponent, ClosedCommunityConfirmDialogComponent, SkillSelectInputStubComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: CommunitiesService,
          useValue: jasmine.createSpyObj('communityService', {'createCommunity': of<CommunityResponse>()})
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('userService', {'getUserSuggestions': of<User[]>(
              [user]
            )})
        },
        {provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])}
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

    communityService = TestBed.get(CommunitiesService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createCommunity method', async(() => {
    component.communityForm.get('title').setValue('title');
    component.communityForm.get('description').setValue('description');
    component.addLink();
    component.communityForm.get('links').setValue([{name: 'google', href: 'https://www.google.com'}]);
    component.communityForm.get('invitedUsers').setValue([user]);

    component.createCommunity();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const expectedRequestData: CommunityRequest = {
        title: 'title',
        description: 'description',
        type: CommunityType.OPEN,
        skillNames: [],
        links: [
          {
            name: 'google',
            href: 'https://www.google.com'
          }
        ],
        invitedUserIds: [user.id]
      } as CommunityRequest;

      expect(communityService.createCommunity).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should disable createButton when an added link is not filled', async(() => {
    component.communityForm.reset();
    component.communityForm.get('title').setValue('title');
    component.communityForm.get('description').setValue('description');
    component.addLink();

    const createButton = fixture.debugElement.query(By.css('#communities-new-button'));
    expect(createButton.nativeElement.disabled).toBeTruthy();
  }));

  it('should disable createButton when title is empty', async(() => {
    component.communityForm.reset();
    component.communityForm.get('title').setValue('');
    component.communityForm.get('description').setValue('description');

    const createButton = fixture.debugElement.query(By.css('#communities-new-button'));
    expect(createButton.nativeElement.disabled).toBeTruthy();
  }));

  it('should open a confirm dialog when community type was set to CLOSED', () => {
    const matDialog: MatDialog = TestBed.get(MatDialog);
    component.communityForm.get('type').setValue('CLOSED');
    component.createCommunity();

    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(ClosedCommunityConfirmDialogComponent));
  });
});
