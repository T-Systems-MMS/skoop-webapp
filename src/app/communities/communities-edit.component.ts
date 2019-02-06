import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Community } from './community';
import { CommunitiesService } from './communities.service';

@Component({
  selector: 'app-communities-edit',
  templateUrl: './communities-edit.component.html',
  styleUrls: ['./communities-edit.component.scss']
})
export class CommunitiesEditComponent implements OnInit {

  communityForm: FormGroup;
  errorMessage: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public community: Community,
              private communityService: CommunitiesService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
    this.communityForm = formBuilder.group({
      title: new FormControl(community.title, Validators.required),
      description: new FormControl(community.description),
      links: new FormArray([])
    });

    (this.community.links || []).forEach(link => {
      this.linkList.push(this.formBuilder.group(
        {
          name: new FormControl(link.name, Validators.required),
          href: new FormControl(link.href, Validators.required)
        }));
    });
  }

  ngOnInit() {
  }

  addLink() {
    this.linkList.push(this.createLink());
  }

  removeLink(index) {
    this.linkList.removeAt(index);
    this.linkList.markAsDirty();
  }

  editCommunity() {
    this.communityService.updateCommunity(this.getCommunityData())
      .pipe(
        finalize(() => {
            this.communityForm.markAsPristine();
          }
        )
      )
      .subscribe(data => {
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

  private createLink(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      href: [null, Validators.required]
    });
  }

  private getCommunityData(): Community {
    return {
      id: this.community.id,
      title: this.communityForm.get('title').value,
      description: this.communityForm.get('description').value,
      links: this.communityForm.get('links').value
    } as Community;
  }

  get linkList() {
    return this.communityForm.get('links') as FormArray;
  }

}
