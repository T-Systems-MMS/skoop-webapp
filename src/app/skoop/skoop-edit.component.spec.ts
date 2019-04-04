import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Observable } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { SkoopEditComponent } from './skoop-edit.component';
import { SkoopService } from './skoop.service';
import { UserSkill } from '../user-skills/user-skill';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { UserSkillView } from '../shared/skill-card/user-skill-view';

const skoopServiceStub: Partial<SkoopService> = {
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

describe('SkoopEditComponent', () => {
  let component: SkoopEditComponent;
  let fixture: ComponentFixture<SkoopEditComponent>;

  beforeEach(async(() => {
    spyOn(skoopServiceStub, 'updateCurrentUserSkill');
    spyOn(bottomSheetStub, 'dismiss');
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SkoopEditComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkoopService, useValue: skoopServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: userSkillTestData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkoopEditComponent);
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
