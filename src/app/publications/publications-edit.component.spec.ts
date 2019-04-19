import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsEditComponent } from './publications-edit.component';
import { PublicationRequest } from './publication-request';
import { PublicationResponse } from './publication-response';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { of } from 'rxjs';
import { PublicationService } from './publication.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const publicationEditData: PublicationResponse = {
  id: '123123123123123',
  title: 'Publication title',
  date: new Date(),
  publisher: 'Publisher',
  link: 'https://www.google.com',
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

describe('PublicationsEditComponent', () => {
  let component: PublicationsEditComponent;
  let fixture: ComponentFixture<PublicationsEditComponent>;

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
      declarations: [PublicationsEditComponent, SkillSelectInputStubComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: MatBottomSheetRef,
          useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])
        },
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: publicationEditData
        },
        {
          provide: PublicationService,
          useValue: jasmine.createSpyObj('publicationService', {'editPublication': of<PublicationResponse>(publicationEditData)})
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill in the form with expected values', () => {
    expect(component.publicationForm.get('title').value).toBe(publicationEditData.title);
    expect(component.publicationForm.get('date').value).toBe(publicationEditData.date);
    expect(component.publicationForm.get('publisher').value).toBe(publicationEditData.publisher);
    expect(component.publicationForm.get('link').value).toBe(publicationEditData.link);
    expect(component.publicationForm.get('skills').value).toEqual(publicationEditData.skills.map(item => item.name));
  });

  it('should send a request to update a publication', () => {
    const publicationRequest: PublicationRequest = {
      id: publicationEditData.id,
      title: 'new title',
      date: publicationEditData.date,
      publisher: 'new publisher',
      link: 'https://www.new-google.com',
      skills: ['Skill1']
    };

    component.publicationForm.get('title').setValue(publicationRequest.title);
    component.publicationForm.get('publisher').setValue(publicationRequest.publisher);
    component.publicationForm.get('link').setValue(publicationRequest.link);
    component.publicationForm.get('skills').setValue(publicationRequest.skills);

    component.editPublication();
    const publicationService: PublicationService = TestBed.get(PublicationService);

    expect(publicationService.editPublication).toHaveBeenCalledWith(publicationRequest);
  });

});
