import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesEditComponent } from './communities-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { of } from 'rxjs';
import { Community } from './community';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

const communityEditData = {
  id: '2134-5679-235235',
  title: 'community',
  description: 'community description'
};

describe('CommunitiesEditComponent', () => {
  let component: CommunitiesEditComponent;
  let fixture: ComponentFixture<CommunitiesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ CommunitiesEditComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {'editCommunity': of<Community>() } ) },
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: communityEditData }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
