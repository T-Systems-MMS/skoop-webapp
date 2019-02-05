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

describe('CommunitiesNewComponent', () => {
  let component: CommunitiesNewComponent;
  let fixture: ComponentFixture<CommunitiesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ CommunitiesNewComponent ],
      providers: [
        GlobalErrorHandlerService,
        { provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {'createCommunity': of<Community>() } ) },
        { provide: MatBottomSheetRef, useValue: jasmine.createSpyObj('matBottomSheetRef', ['dismiss'] ) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
