import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CommunitiesComponent } from './communities.component';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { of } from 'rxjs';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { Community } from './community';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommunitiesFilterPipe } from './communities-filter.pipe';

const communities = [
  {
    id: '123',
    title: 'group1',
    description: 'super group description',
    links: [
      {
        name: 'google',
        href: 'https://www.google.com'
      },
      {
        name: 'stackoveflow',
        href: 'https://stackoverflow.com/'
      }]
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
        MatMomentDateModule,
        ReactiveFormsModule
      ],
      declarations: [CommunitiesComponent, CommunitiesFilterPipe],
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

  it('should initialize the list of communities', fakeAsync(() => {
    fixture.detectChanges();
    const communitiesCards = fixture.debugElement.queryAll(By.css(('.communities-card')));

    expect(communitiesCards.length).toBe(2);
    expect(communitiesCards[0].query(By.css('.communities-card__heading')).nativeElement.textContent).toBe(communities[0].title);
    expect(communitiesCards[1].query(By.css('.communities-card__heading')).nativeElement.textContent).toBe(communities[1].title);
  }));
});
