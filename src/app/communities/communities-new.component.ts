import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Community } from './community';

@Component({
  selector: 'app-communities-new',
  templateUrl: './communities-new.component.html',
  styleUrls: ['./communities-new.component.scss']
})
export class CommunitiesNewComponent implements OnInit {

  communityForm: FormGroup;
  errorMessage: string = null;

  constructor(private communityService: CommunitiesService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit() {
    this.communityForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  createCommunity() {
    this.communityService.createCommunity(this.getCommunityData())
      .subscribe(() => {
        this.communityForm.reset();
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();

      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private getCommunityData(): Community {
    return {
      title: this.communityForm.get('title').value,
      description: this.communityForm.get('description').value
    } as Community;
  }

}
