import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { Observable } from 'rxjs';
import 'hammerjs';

import { AppMaterialModule } from '../app-material.module';
import { MySkillsNewComponent } from './my-skills-new.component';
import { MySkillsService } from './my-skills.service';
import { UserSkill } from '../user-skills/user-skill';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

const mySkillsServiceStub: Partial<MySkillsService> = {
  createCurrentUserSkill(skillName: string, currentLevel: number, desiredLevel: number, priority: number):
    Observable<UserSkill> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

describe('MySkillsNewComponent', () => {
  let component: MySkillsNewComponent;
  let fixture: ComponentFixture<MySkillsNewComponent>;

  beforeEach(async(() => {
    spyOn(mySkillsServiceStub, 'createCurrentUserSkill');
    spyOn(bottomSheetStub, 'dismiss');
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [MySkillsNewComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: MySkillsService, useValue: mySkillsServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySkillsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
