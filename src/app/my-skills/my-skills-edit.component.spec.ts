import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Observable } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { MySkillsEditComponent } from './my-skills-edit.component';
import { MySkillsService } from './my-skills.service';
import { UserSkill } from '../user-skills/user-skill';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UserSkillView } from '../skill-card/user-skill-view';

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
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: userSkillTestData }
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
});
