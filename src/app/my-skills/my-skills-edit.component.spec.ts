import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { MySkillsEditComponent } from './my-skills-edit.component';
import { MySkillsService } from './my-skills.service';
import { UserSkill } from '../user-skills/user-skill';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { DebugElement } from '@angular/core';
import { UserSkillView } from '../shared/skill-card/user-skill-view';
import { ExternalAssetsService } from '../shared/external-assets.service';
import { StepDescription } from './step-description';
import { MatSliderChange } from '@angular/material';

const mySkillsServiceStub: Partial<MySkillsService> = {
  updateCurrentUserSkill(skillId: string, currentLevel: number, desiredLevel: number, priority: number):
    Observable<UserSkill> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

const userSkillTestData: UserSkillView = {
  skill: {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    name: 'Angular'
  },
  currentLevel: 2,
  desiredLevel: 3,
  priority: 4
};

const levelDescription: StepDescription = {
  step0: 'zero',
  step1: 'one',
  step2: 'two',
  step3: 'three',
  step4: 'four'
};

describe('MySkillsEditComponent', () => {
  let component: MySkillsEditComponent;
  let fixture: ComponentFixture<MySkillsEditComponent>;

  beforeEach(async(() => {
    spyOn(mySkillsServiceStub, 'updateCurrentUserSkill');
    spyOn(bottomSheetStub, 'dismiss');
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [MySkillsEditComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: MySkillsService, useValue: mySkillsServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: userSkillTestData },
        {
          provide: ExternalAssetsService, useValue: jasmine.createSpyObj('externalAssetsService', {
            'getJSON': of(levelDescription)
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySkillsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have <h2> with "Angular"', async(() => {
    // access through nativeElement
    const mySkillEditElement: HTMLElement = fixture.nativeElement;
    const h2 = mySkillEditElement.querySelector('h2');
    expect(h2.textContent).toContain('Angular');
  }));

  it('should find the <h2> with fixture.debugElement.nativeElement)', async(() => {
    // access through debugElement
    const mySkillEditDe: DebugElement = fixture.debugElement;
    const mySkillEditEl: HTMLElement = mySkillEditDe.nativeElement;
    const h2 = mySkillEditEl.querySelector('h2');
    expect(h2.textContent).toEqual('Angular');
  }));

  it('should set title for current and desired levels', async(() => {
    expect(component.currentLevelSlider._elementRef.nativeElement.querySelector('.mat-slider-thumb').getAttribute('title'))
      .toBe(levelDescription.step2);
    expect(component.desiredLevelSlider._elementRef.nativeElement.querySelector('.mat-slider-thumb').getAttribute('title'))
      .toBe(levelDescription.step3);
  }));

  it('should update title for current level when current level changed', async (() => {
    const event: MatSliderChange = {
      source: component.currentLevelSlider,
      value: 0
    };

    component.onLevelValueChanged(event);
    expect(component.currentLevelSlider._elementRef.nativeElement.querySelector('.mat-slider-thumb').getAttribute('title'))
      .toBe(levelDescription.step0);
  }));
});
