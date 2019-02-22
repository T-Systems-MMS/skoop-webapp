import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { CommunitiesNewComponent } from './communities-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { MatBottomSheetRef, MatDialog } from '@angular/material';
import { CommunitiesService } from './communities.service';
import { By } from '@angular/platform-browser';
import { CommunityType } from './community-type.enum';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { SkillsService } from '../skills/skills.service';
import { CommunityRequest } from './community-request';
import { Skill } from '../skills/skill';
import { CommunityResponse } from './community-response';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ENTER } from '@angular/cdk/keycodes';

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
      declarations: [CommunitiesNewComponent, ClosedCommunityConfirmDialogComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: CommunitiesService,
          useValue: jasmine.createSpyObj('communityService', {'createCommunity': of<CommunityResponse>()})
        },
        {
          provide: SkillsService,
          useValue: jasmine.createSpyObj('skillsService', {'getAllSkills': of<Skill[]>(skills)})
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

    component.createCommunity();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const expectedRequestData: CommunityRequest = {
        title: 'title',
        description: 'description',
        type: CommunityType.OPENED,
        skillNames: [],
        links: [
          {
            name: 'google',
            href: 'https://www.google.com'
          }
        ]
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
