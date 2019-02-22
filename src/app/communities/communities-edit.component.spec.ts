import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { CommunitiesEditComponent } from './communities-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { of } from 'rxjs';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog } from '@angular/material';
import { By } from '@angular/platform-browser';
import { CommunityType } from './community-type.enum';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CommunityResponse } from './community-response';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ENTER } from '@angular/cdk/keycodes';

const communityEditData = {
  id: '2134-5679-235235',
  title: 'community',
  description: 'community description',
  type: CommunityType.OPENED,
  skills: [],
  links: [
    {
      name: 'google',
      href: 'https://www.google.com'
    }
  ],
  managers: [{id: '123sdfsdferwe'}],
  members: [{id: 'jd934kjsdi823'}]
};

const communityEditRequest = {
  id: communityEditData.id,
  title: communityEditData.title,
  description: communityEditData.description,
  type: communityEditData.type,
  skillNames: [],
  links: communityEditData.links,
  managerIds: [communityEditData.managers[0].id],
  memberIds: [communityEditData.members[0].id]
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
      declarations: [CommunitiesEditComponent, ClosedCommunityConfirmDialogComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: CommunitiesService,
          useValue: jasmine.createSpyObj('communityService', {'updateCommunity': of<CommunityResponse>()})
        },
        {provide: SkillsService, useValue: jasmine.createSpyObj('skillsService', {'getAllSkills': of<Skill[]>(skills)})},
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
  it('should filter skills based on input', fakeAsync(() => {
    sendInput('Angular');

    const options = overlayContainerElement.querySelectorAll('mat-option');
    expect(options.length).toBe(1);
    expect(options[0].innerHTML).toContain('Angular');

    discardPeriodicTasks();
  }));

  it('should add skill to the skills list', fakeAsync(() => {
    sendInput('Angular');

    const option = overlayContainerElement.querySelector('mat-option') as HTMLElement;
    tick(10);

    option.click();
    fixture.whenStable().then( () => {
      expect(component.skillsArray.length).toBe(1);
      expect(component.skillsArray[0]).toEqual(skills[0].name);
    });

    discardPeriodicTasks();
  }));

  it('should not add duplicated skills to the skills list', fakeAsync(() => {
    sendInput('Angular');

    let option = overlayContainerElement.querySelector('mat-option') as HTMLElement;
    tick(10);
    option.click();
    sendInput('Angular');
    option = overlayContainerElement.querySelector('mat-option') as HTMLElement;
    tick(10);
    option.click();

    fixture.whenStable().then( () => {
      expect(component.skillsArray.length).toBe(1);
      expect(component.skillsArray[0]).toEqual(skills[0].name);
    });

    discardPeriodicTasks();
  }));

  it('should add new elem to the skills array on enter click', () => {
    const value = 'new skill';
    expect(component.skillsArray.indexOf(value)).toBe(-1);

    const skillDebugElement = fixture.debugElement.query(By.css('#skillsChipList'));
    const inputNativeElement = skillDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(component.skillsArray.indexOf(value)).not.toBe(-1);
  });

  function sendInput(text: string) {
    let inputElement: HTMLInputElement;

    inputElement = component.skillAutocompleteInput.nativeElement;
    inputElement.value = text;
    component.skillAutocompleteCtrl.setValue(text);
    inputElement.dispatchEvent(new Event('focusin'));

    fixture.detectChanges();
  }
});
