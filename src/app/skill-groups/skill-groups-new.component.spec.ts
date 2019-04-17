import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupsNewComponent } from './skill-groups-new.component';

import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { of } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroup } from './skill-group';
import { By } from '@angular/platform-browser';

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

describe('SkillGroupsNewComponent', () => {
  let component: SkillGroupsNewComponent;
  let fixture: ComponentFixture<SkillGroupsNewComponent>;

  beforeEach(async(() => {
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
        {
          provide: SkillGroupsService, useValue: jasmine.createSpyObj('skillGroupsService', {
            'createSkillGroup': of<SkillGroup>({
              id: '123123',
              name: 'Skill group 1',
              description: 'Skill group description'
            }),
            'isSkillGroupExist': of<Boolean>(true)
          })
        },
        {provide: MatBottomSheetRef, useValue: bottomSheetStub}
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

  it('should display error if group already exists', () => {
    component.groupName.setValue('groupName');
    expect(component.errorMessage).not.toBe('');
  });

  it('should call skillGroupsService.createSkillGroup method and increment count of created groups ', () => {
    expect(component.addedGroupsCount).toBe(0);
    const name = 'groupName';
    component.groupName.setValue(name);
    const description = 'groupDescription';
    component.groupDescription.setValue(description);
    component.addGroup();

    const skillGroupsService: SkillGroupsService = TestBed.get(SkillGroupsService) as SkillGroupsService;
    expect(skillGroupsService.createSkillGroup).toHaveBeenCalledWith(name, description);
    expect(component.addedGroupsCount).toBe(1);
  });

  it('should create a group on ENTER press', () => {
    const name = 'groupName';
    component.groupName.setValue(name);
    const description = 'groupDescription';
    component.groupDescription.setValue(description);

    const form = fixture.debugElement.query(By.css('.skoop-new'));
    const event = new KeyboardEvent('keypress', {
      key: 'Enter'
    });
    form.nativeElement.dispatchEvent(event);

    const skillGroupsService: SkillGroupsService = TestBed.get(SkillGroupsService) as SkillGroupsService;
    expect(skillGroupsService.createSkillGroup).toHaveBeenCalledWith(name, description);
  });
});
