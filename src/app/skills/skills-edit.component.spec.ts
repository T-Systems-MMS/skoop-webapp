import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsEditComponent } from './skills-edit.component';
import { Skill } from './skill';
import { Observable } from 'rxjs';
import { SkillsService } from './skills.service';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';

const skillsServiceStub: Partial<SkillsService> = {
  createSkill(name: string, description: string):
    Observable<Skill> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

const userSkillTestData: Skill = {
  id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  name: 'Angular',
  description: ''
};

describe('SkillsEditComponent', () => {
  let component: SkillsEditComponent;
  let fixture: ComponentFixture<SkillsEditComponent>;

  beforeEach(async(() => {
    spyOn(skillsServiceStub, 'createSkill');
    spyOn(bottomSheetStub, 'dismiss');
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SkillsEditComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkillsService, useValue: skillsServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: userSkillTestData }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
