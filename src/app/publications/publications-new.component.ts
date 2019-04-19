import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheetRef } from '@angular/material';
import { PublicationService } from './publication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicationRequest } from './publication-request';
import { Util } from '../util/util';
import { FormsService } from '../shared/forms.service';

@Component({
  selector: 'app-publications-new',
  templateUrl: './publications-new.component.html',
  styleUrls: ['./publications-new.component.scss']
})
export class PublicationsNewComponent implements OnInit {

  publicationForm: FormGroup;
  errorMessage: string = null;
  maxDate: Date = new Date();

  constructor(private publicationService: PublicationService,
              private formsService: FormsService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheetRef) {
  }

  ngOnInit() {
    this.publicationForm = this.formBuilder.group({
      title: ['', Validators.required],
      date: '',
      publisher: ['', Validators.required],
      link: '',
      skills: ''
    },
      {
        validators: [
          this.formsService.validatorFnOf('dateInFuture', Util.dateIsInPast)
        ]
      });
  }

  addPublication() {
    this.publicationService.createPublication(this.getPublicationData())
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
