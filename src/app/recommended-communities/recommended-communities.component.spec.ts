import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { RecommendedCommunitiesComponent } from './recommended-communities.component';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityCardComponent } from '../shared/community-card/community-card.component';
import { CommunityResponse } from '../communities/community-response';
import { CommunityType } from '../communities/community-type.enum';
import { User } from '../users/user';
import { CommunitiesService } from '../communities/communities.service';
import { of } from 'rxjs';
import { Community } from '../communities/community';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatDialog } from '@angular/material';
import { ClosedCommunityInfoDialogComponent } from '../shared/closed-community-info-dialog/closed-community-info-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

const communities: CommunityResponse[] = [
  {
    id: '123',
    title: 'group1',
    description: 'super group description',
    type: CommunityType.OPENED,
    recommended: true,
    links: [
      {
        name: 'google',
        href: 'https://www.google.com'
      },
      {
        name: 'stackoveflow',
        href: 'https://stackoverflow.com/'
      }],
    members: [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'tester'
      } as User
    ],
    managers: [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'tester'
      } as User
    ]
  },
  {
    id: '123456',
    title: 'group2',
    description: 'other group',
    type: CommunityType.OPENED,
    members: [
      {
        id: 'c6d8badc-0f80-4d20-b436-0e7e871f97f5',
        userName: 'anotherTester'
      } as User
    ],
    managers: [
      {
        id: 'c6d8badc-0f80-4d20-b436-0e7e871f97f5',
        userName: 'anotherTester'
      } as User
    ]
  }
];

describe('RecommendedCommunitiesComponent', () => {
  let component: RecommendedCommunitiesComponent;
  let fixture: ComponentFixture<RecommendedCommunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ RecommendedCommunitiesComponent, CommunityCardComponent, ClosedCommunityInfoDialogComponent ],
      providers: [
        {
          provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {
            'getRecommendedCommunities': of<Community[]>(communities),
            'joinCommunity': of<CommunityResponse>({
              id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
              title: 'test1',
              type: CommunityType.OPENED,
              description: 'description1',
              links: [{
                name: 'google',
                href: 'https://www.google.com'
              },
                {
                  name: 'stackoveflow',
                  href: 'https://stackoverflow.com/'
                }],
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}],
              members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
            } as CommunityResponse)
          })
        },
        GlobalErrorHandlerService
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ClosedCommunityInfoDialogComponent]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should display closed community info dialog', fakeAsync(() => {
    const closedCommunity = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      type: CommunityType.CLOSED,
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }],
      managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}],
      members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
    };
    const communityService = TestBed.get(CommunitiesService) as CommunitiesService;
    communityService.joinCommunity = jasmine.createSpy().and.returnValue(of(closedCommunity));

    component.joinCommunity({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'} as CommunityResponse);
    fixture.detectChanges();

    const matDialog: MatDialog = TestBed.get(MatDialog);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(ClosedCommunityInfoDialogComponent));
  }));
});
