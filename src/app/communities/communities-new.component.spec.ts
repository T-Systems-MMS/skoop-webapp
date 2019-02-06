import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesNewComponent } from './communities-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material';
import { CommunitiesService } from './communities.service';
import { Community } from './community';
import { By } from '@angular/platform-browser';

describe('CommunitiesNewComponent', () => {
  let component: CommunitiesNewComponent;
  let fixture: ComponentFixture<CommunitiesNewComponent>;
  let communityService: CommunitiesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [CommunitiesNewComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: CommunitiesService,
          useValue: jasmine.createSpyObj('communityService', {'createCommunity': of<Community>()})
        },
        {provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'])}
      ]
    })
      .compileComponents();

    communityService = TestBed.get(CommunitiesService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the createCommunity method', async(() => {
    component.communityForm.get('title').setValue('title');
    component.communityForm.get('description').setValue('description');
    component.addLink();
    component.communityForm.get('links').setValue([{name: 'google', href: 'https://www.google.com'}]);

    component.createCommunity();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const expectedRequestData: Community = {
        title: 'title',
        description: 'description',
        links: [
          {
            name: 'google',
            href: 'https://www.google.com'
          }
        ]
      } as Community;

      expect(communityService.createCommunity).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should disable createButton when an added link is not filled', async(() => {
    component.communityForm.reset();
    component.communityForm.get('title').setValue('title');
    component.communityForm.get('description').setValue('description');
    component.addLink();

    const createButton = fixture.debugElement.query(By.css('#communities-new-button'));
    expect(createButton.nativeElement.disabled).toBeTruthy();
  }));

  it('should disable createButton when title is empty', async(() => {
    component.communityForm.reset();
    component.communityForm.get('title').setValue('');
    component.communityForm.get('description').setValue('description');

    const createButton = fixture.debugElement.query(By.css('#communities-new-button'));
    expect(createButton.nativeElement.disabled).toBeTruthy();
  }));
});
