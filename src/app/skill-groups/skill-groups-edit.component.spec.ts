import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupsEditComponent } from './skill-groups-edit.component';
import { SkillGroupsService } from './skill-groups.service';
import { Observable } from 'rxjs';
import { SkillGroup } from './skill-group';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

const skillGroupsServiceStub: Partial<SkillGroupsService> = {
  updateSkillGroup(name: string, description: string):
    Observable<SkillGroup> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

const userSkillTestData: SkillGroup = {
  id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  name: 'Programming',
  description: ''
};

describe('SkillGroupsEditComponent', () => {
  let component: SkillGroupsEditComponent;
  let fixture: ComponentFixture<SkillGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SkillGroupsEditComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: SkillGroupsService, useValue: skillGroupsServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: userSkillTestData }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
