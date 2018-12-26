import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SkillsNewComponent } from './skills-new.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { SkillsService } from './skills.service';
import { Observable, of } from 'rxjs';
import { Skill } from './skill';
import { MatBottomSheetRef } from '@angular/material';
import { SkillGroupsService } from '../skill-groups/skill-groups.service';

const skillsServiceStub: Partial<SkillsService> = {
  createSkill(name: string, description: string):
    Observable<Skill> { return null; },
  isSkillExist(search: string): Observable<boolean> { return null; }
};

const skillGroupsServiceStub: Partial<SkillGroupsService> = {
  getSkillGroupSuggestions(search: string):
    Observable<string[]> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

describe('SkillsNewComponent', () => {
  let component: SkillsNewComponent;
  let fixture: ComponentFixture<SkillsNewComponent>;
  let skillGroupsServiceSpy;

  beforeEach(async(() => {
    spyOn(skillsServiceStub, 'createSkill');
    skillGroupsServiceSpy = spyOn(skillGroupsServiceStub, 'getSkillGroupSuggestions');
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
        { provide: SkillGroupsService, useValue: skillGroupsServiceStub },
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

  it('should send getSkillGroupSuggestions request in 500 ms', fakeAsync(() => {
    const skillGroupsService = TestBed.get(SkillGroupsService) as SkillGroupsService;
    skillGroupsServiceSpy.and.returnValue(of([]));

    component.groupCtrl.setValue('test');
    tick(200);
    fixture.detectChanges();

    expect(skillGroupsService.getSkillGroupSuggestions).not.toHaveBeenCalled();

    tick(300);
    fixture.detectChanges();
    expect(skillGroupsService.getSkillGroupSuggestions).toHaveBeenCalled();

    discardPeriodicTasks();
  }));

  it('should send isSkillExist request in 500 ms', fakeAsync(() => {
    const skillsService = TestBed.get(SkillsService) as SkillsService;
    spyOn(skillsService, 'isSkillExist').and.returnValue(of([]));

    component.skillName.setValue('test');
    tick(200);
    fixture.detectChanges();

    expect(skillsService.isSkillExist).not.toHaveBeenCalled();

    tick(300);
    fixture.detectChanges();
    expect(skillsService.isSkillExist).toHaveBeenCalled();

    discardPeriodicTasks();
  }));
});
