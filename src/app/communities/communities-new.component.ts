import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Community } from './community';
import { CommunityType } from './community-type.enum';

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
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.communityForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      type: new FormControl(CommunityType.OPENED),
      description: new FormControl(''),
      links: new FormArray([])
    });
  }

  addLink() {
    this.linkList.push(this.createLinkFormGroup());
  }

  removeLink(index) {
    this.linkList.removeAt(index);
  }

  createCommunity() {
    this.communityService.createCommunity(this.getCommunityData())
      .subscribe((data) => {
        this.communityForm.reset();
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();

      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private createLinkFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      href: [null, Validators.required]
    });
  }

  private getCommunityData(): Community {
    return {
      title: this.communityForm.get('title').value,
      type: this.communityForm.get('type').value,
      description: this.communityForm.get('description').value,
      links: this.communityForm.get('links').value
    } as Community;
  }

  get linkList() {
    return this.communityForm.get('links') as FormArray;
  }

}
