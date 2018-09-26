import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsNewComponent } from './skills-new.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { SkillsService } from './skills.service';
import { Observable } from 'rxjs';
import { Skill } from './skill';
import { MatBottomSheetRef } from '@angular/material';

const skillsServiceStub: Partial<SkillsService> = {
  createSkill(name: string, description: string):
    Observable<Skill> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

describe('SkillsNewComponent', () => {
  let component: SkillsNewComponent;
  let fixture: ComponentFixture<SkillsNewComponent>;

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
      declarations: [ SkillsNewComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkillsService, useValue: skillsServiceStub},
        { provide: MatBottomSheetRef, useValue: bottomSheetStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
