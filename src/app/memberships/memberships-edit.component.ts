import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MembershipService } from './membership.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MembershipResponse } from './membership-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MembershipRequest } from './membership-request';

@Component({
  selector: 'app-memberships-edit',
  templateUrl: './memberships-edit.component.html',
  styleUrls: ['./memberships-edit.component.scss']
})
export class MembershipsEditComponent implements OnInit {

  membershipForm: FormGroup;
  errorMessage: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public membership: MembershipResponse,
              private membershipService: MembershipService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheetRef) {
  }

  ngOnInit() {
    this.membershipForm = this.formBuilder.group({
      name: new FormControl(this.membership.name, Validators.required),
      description: new FormControl(this.membership.description),
      link: new FormControl(this.membership.link),
      skills: new FormControl((this.membership.skills || []).map(item => item.name)),
    });
  }

  editMembership() {
    this.membershipService.editMembership(this.getMembershipData())
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
      id: this.membership.id,
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
