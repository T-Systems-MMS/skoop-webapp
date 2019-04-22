import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheetRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { MembershipService } from './membership.service';
import { MembershipRequest } from './membership-request';

@Component({
  selector: 'app-memberships-new',
  templateUrl: './memberships-new.component.html',
  styleUrls: ['./memberships-new.component.scss']
})
export class MembershipsNewComponent implements OnInit {

  membershipForm: FormGroup;
  errorMessage: string = null;

  constructor(private membershipService: MembershipService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheetRef) {
  }

  ngOnInit() {
    this.membershipForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      link: new FormControl(''),
      skills: new FormControl([])
    });
  }

  addMembership() {
    this.membershipService.createMembership(this.getMembershipData())
      .subscribe((data) => {
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  private getMembershipData(): MembershipRequest {
    return {
      name: this.membershipForm.get('name').value,
      description: this.membershipForm.get('description').value,
      link: this.membershipForm.get('link').value,
      skills: this.skillsArray || []
    } as MembershipRequest;
  }

  get skillsArray(): string[] {
    return this.membershipForm.get('skills').value;
  }

}
