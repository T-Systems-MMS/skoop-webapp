import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HttpErrorResponse } from '@angular/common/http';
import { MembershipService } from './membership.service';
import { MembershipRequest } from './membership-request';
import { Util } from '../util/util';
import { Moment } from 'moment';

@Component({
  selector: 'app-memberships-new',
  templateUrl: './memberships-new.component.html',
  styleUrls: ['./memberships-new.component.scss']
})
export class MembershipsNewComponent implements OnInit {

  membershipForm: FormGroup;
  errorMessage: string = null;
  maxDate: Date = new Date();

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
      skills: new FormControl([]),
      startDate: new FormControl(),
      endDate: new FormControl()
    }, { validators: (control: FormGroup): ValidationErrors | null => {
        const startDate = control.get('startDate');
        const endDate = control.get('endDate');
        return endDate && startDate && !startDate.value && endDate.value ? { 'endDateCannotBeDefinedWithoutStartDate': true } : null;
      }
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
      skills: this.skillsArray || [],
      startDate: Util.ignoreTimezone(this.membershipForm.get('startDate').value as Moment),
      endDate: Util.ignoreTimezone(this.membershipForm.get('endDate').value as Moment)
    } as MembershipRequest;
  }

  get skillsArray(): string[] {
    return this.membershipForm.get('skills').value;
  }

}
