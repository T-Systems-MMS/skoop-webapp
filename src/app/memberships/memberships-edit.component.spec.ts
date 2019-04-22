import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsEditComponent } from './memberships-edit.component';
import { MembershipResponse } from './membership-response';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AppMaterialModule } from '../app-material.module';
import { Component, Input } from '@angular/core';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { of } from 'rxjs';
import { MembershipService } from './membership.service';
import { MembershipRequest } from './membership-request';


@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const membershipEditData: MembershipResponse = {
  id: '369710e0-5808-4318-961e-0161f9f81f1c',
  name: 'Topic',
  description: 'Additional Information',
  link: 'https://www.google.com',
  skills: [
    {
      id: '1f5082a3-f7cf-4d6b-ad41-df8bce06e03f',
      name: 'Java',
      description: 'Java programming language.',
      skillGroups: null
    }
  ]
};

describe('MembershipsEditComponent', () => {
  let component: MembershipsEditComponent;
  let fixture: ComponentFixture<MembershipsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatMomentDateModule,
        AppMaterialModule
      ],
      declarations: [ MembershipsEditComponent, SkillSelectInputStubComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: MatBottomSheetRef,
          useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])
        },
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: membershipEditData
        },
        {
          provide: MembershipService,
          useValue: jasmine.createSpyObj('membershipService', {'editMembership': of<MembershipResponse>(membershipEditData)})
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill in the form with expected values', () => {
    expect(component.membershipForm.get('name').value).toBe(membershipEditData.name);
    expect(component.membershipForm.get('description').value).toBe(membershipEditData.description);
    expect(component.membershipForm.get('link').value).toBe(membershipEditData.link);
    expect(component.membershipForm.get('skills').value).toEqual(membershipEditData.skills.map(item => item.name));
  });

  it('should send a request to update a membership', () => {
    const membershipRequest: MembershipRequest = {
      id: membershipEditData.id,
      name: 'new title',
      description: membershipEditData.description,
      link: 'https://www.new-google.com',
      skills: ['Skill1']
    };

    component.membershipForm.get('name').setValue(membershipRequest.name);
    component.membershipForm.get('description').setValue(membershipRequest.description);
    component.membershipForm.get('link').setValue(membershipRequest.link);
    component.membershipForm.get('skills').setValue(membershipRequest.skills);

    component.editMembership();
    const membershipService: MembershipService = TestBed.get(MembershipService);

    expect(membershipService.editMembership).toHaveBeenCalledWith(membershipRequest);
  });
});
