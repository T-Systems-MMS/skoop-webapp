import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsNewComponent } from './publications-new.component';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material';
import { PublicationService } from './publication.service';
import { PublicationResponse } from './publication-response';
import { PublicationRequest } from './publication-request';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-skill-select-input',
  template: ''
})
class SkillSelectInputStubComponent {
  @Input() parentForm: FormGroup;
}

const publicationRequest: PublicationRequest = {
  title: 'Publication title',
  date: new Date(),
  publisher: 'Publisher',
  link: 'https://www.google.com',
  skills: ['Skill1', 'Skill2']
};

const publicationResponse: PublicationResponse = {
  id: '123123123123123',
  title: publicationRequest.title,
  date: publicationRequest.date,
  publisher: publicationRequest.publisher,
  link: publicationRequest.link,
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

describe('PublicationsNewComponent', () => {
  let component: PublicationsNewComponent;
  let fixture: ComponentFixture<PublicationsNewComponent>;

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
      declarations: [ PublicationsNewComponent, SkillSelectInputStubComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: PublicationService,
          useValue: jasmine.createSpyObj('publicationService', {'createPublication': of<PublicationResponse>(publicationResponse)})
        },
        {
          provide: MatBottomSheetRef,
          useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createPublication method', async(() => {
    component.publicationForm.get('title').setValue(publicationRequest.title);
    component.publicationForm.get('date').setValue(publicationRequest.date);
    component.publicationForm.get('publisher').setValue(publicationRequest.publisher);
    component.publicationForm.get('link').setValue(publicationRequest.link);
    component.publicationForm.get('skills').setValue(publicationRequest.skills);

    component.addPublication();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const publicationService = TestBed.get(PublicationService) as PublicationService;

      expect(publicationService.createPublication).toHaveBeenCalledWith(publicationRequest);
    });
  }));
});
