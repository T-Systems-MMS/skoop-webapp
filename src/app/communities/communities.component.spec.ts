import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitiesComponent } from './communities.component';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { of } from 'rxjs';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { Community } from './community';

const communities = [
  {
    id: '123',
    title: 'group1',
    description: 'super group description'
  },
  {
    id: '123456',
    title: 'group2',
    description: 'other group'
  }
];

describe('CommunitiesComponent', () => {
  let component: CommunitiesComponent;
  let fixture: ComponentFixture<CommunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule
      ],
      declarations: [CommunitiesComponent],
      providers: [
        {
          provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {
            'getCommunities': of<Community[]>(communities),
            'deleteCommunity': of<void>()
          })
        },
        GlobalErrorHandlerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
