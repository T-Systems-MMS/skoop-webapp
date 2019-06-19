import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommunitiesService } from './communities.service';
import { CommunityType } from './community-type.enum';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { CommunityRequest } from './community-request';
import { CommunityResponse } from './community-response';

@Component({
  selector: 'app-communities-edit',
  templateUrl: './communities-edit.component.html',
  styleUrls: ['./communities-edit.component.scss']
})
export class CommunitiesEditComponent implements OnInit {

  communityForm: FormGroup;
  errorMessage: string = null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public community: CommunityResponse,
              private communityService: CommunitiesService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              public dialog: MatDialog) {

  }

  ngOnInit() {
    this.communityForm = this.formBuilder.group({
      title: new FormControl(this.community.title, Validators.required),
      type: new FormControl(this.community.type),
      skills: new FormControl((this.community.skills || []).map(item => item.name)),
      description: new FormControl(this.community.description),
      links: new FormArray([])
    });

    if (this.community.links) {
      this.community.links.forEach(link => {
        this.linkList.push(this.formBuilder.group(
          {
            id: new FormControl(link.id),
            name: new FormControl(link.name, Validators.required),
            href: new FormControl(link.href, Validators.required)
          }));
      });
    }
  }

  addLink() {
    this.linkList.push(this.createLinkFormGroup());
  }

  removeLink(index) {
    this.linkList.removeAt(index);
    this.linkList.markAsDirty();
  }

  editCommunity() {
    const communityData = this.getCommunityData();
    if (communityData.type === CommunityType.OPEN || communityData.type === this.community.type) {
      this.innerEditCommunity(communityData);
    } else {
      const dialogRef = this.dialog.open(ClosedCommunityConfirmDialogComponent, {
        width: '350px',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.innerEditCommunity(communityData);
        }
      });
    }
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private createLinkFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: null,
      name: [null, Validators.required],
      href: [null, Validators.required]
    });
  }

  private getCommunityData(): CommunityRequest {
    return {
      id: this.community.id,
      title: this.communityForm.get('title').value,
      type: this.communityForm.get('type').value,
      skillNames: this.skillsArray || [],
      description: this.communityForm.get('description').value,
      links: this.communityForm.get('links').value
    } as CommunityRequest;
  }

  private innerEditCommunity(community: CommunityRequest) {
    this.communityService.updateCommunity(community)
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

  get linkList() {
    return this.communityForm.get('links') as FormArray;
  }

  get skillsArray(): string[] {
    return this.communityForm.get('skills').value;
  }

}
