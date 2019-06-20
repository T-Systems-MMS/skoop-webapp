import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipsNewComponent } from './memberships-new.component';
import { MembershipRequest } from './membership-request';
import { MembershipResponse } from './membership-response';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MembershipService } from './membership.service';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const membershipRequest: MembershipRequest = {
  name: 'membership name',
  description: 'Additional Information',
  link: 'https://www.google.com',
  skills: ['Skill1', 'Skill2']
};

const membershipResponse: MembershipResponse = {
  id: '123123123123123',
  name: membershipRequest.name,
  description: membershipRequest.description,
  link: membershipRequest.link,
  skills: [
    {
      id: '1231231',
      name: 'Skill1'
    },
    {
      id: '4325345345',
      name: 'Skill2'
    },
  ]
};

describe('MembershipsNewComponent', () => {
  let component: MembershipsNewComponent;
  let fixture: ComponentFixture<MembershipsNewComponent>;

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
      declarations: [ MembershipsNewComponent, SkillSelectInputStubComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: MembershipService,
          useValue: jasmine.createSpyObj('membershipService', {'createMembership': of<MembershipResponse>(membershipResponse)})
        },
        {
          provide: MatBottomSheetRef,
          useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createMembership method', async(() => {
    component.membershipForm.get('name').setValue(membershipRequest.name);
    component.membershipForm.get('description').setValue(membershipRequest.description);
    component.membershipForm.get('link').setValue(membershipRequest.link);
    component.membershipForm.get('skills').setValue(membershipRequest.skills);

    component.addMembership();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const membershipService = TestBed.get(MembershipService) as MembershipService;

      expect(membershipService.createMembership).toHaveBeenCalledWith(membershipRequest);
    });
  }));
});
