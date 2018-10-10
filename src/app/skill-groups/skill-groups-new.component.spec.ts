import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupsNewComponent } from './skill-groups-new.component';

import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { Observable } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroup } from './skill-group';

const skillGroupsServiceStub: Partial<SkillGroupsService> = {
  createSkillGroup(name: string, description: string):
    Observable<SkillGroup> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

describe('SkillGroupsNewComponent', () => {
  let component: SkillGroupsNewComponent;
  let fixture: ComponentFixture<SkillGroupsNewComponent>;

  beforeEach(async(() => {
    spyOn(skillGroupsServiceStub, 'createSkillGroup');
    spyOn(bottomSheetStub, 'dismiss');
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ SkillGroupsNewComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkillGroupsService, useValue: skillGroupsServiceStub},
        { provide: MatBottomSheetRef, useValue: bottomSheetStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
