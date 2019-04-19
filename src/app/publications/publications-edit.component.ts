import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicationService } from './publication.service';
import { FormsService } from '../shared/forms.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { Util } from '../util/util';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicationRequest } from './publication-request';
import { PublicationResponse } from './publication-response';

@Component({
  selector: 'app-publications-edit',
  templateUrl: './publications-edit.component.html',
  styleUrls: ['./publications-edit.component.scss']
})
export class PublicationsEditComponent implements OnInit {

  publicationForm: FormGroup;
  errorMessage: string = null;
  maxDate: Date = new Date();

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public publication: PublicationResponse,
              private publicationService: PublicationService,
              private formsService: FormsService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheetRef) {
  }

  ngOnInit() {
    this.publicationForm = this.formBuilder.group({
        title: [this.publication.title, Validators.required],
        date: this.publication.date,
        publisher: [this.publication.publisher, Validators.required],
        link: this.publication.link,
        skills: (this.publication.skills || []).map(item => item.name)
      },
      {
        validators: [
          this.formsService.validatorFnOf('dateInFuture', Util.dateIsInFuture)
        ]
      });
  }

  editPublication() {
    this.publicationService.editPublication(this.getPublicationData())
      .subscribe((data) => {
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  private getPublicationData(): PublicationRequest {
    return {
      id: this.publication.id,
      title: this.publicationForm.get('title').value,
      date: this.publicationForm.get('date').value,
      publisher: this.publicationForm.get('publisher').value,
      link: this.publicationForm.get('link').value,
      skills: this.skillsArray || []
    } as PublicationRequest;
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  get skillsArray(): string[] {
    return this.publicationForm.get('skills').value;
  }

}
