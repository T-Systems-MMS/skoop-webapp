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
import { CommunityType } from './community-type.enum';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';
import { CommunityResponse } from './community-response';
import { User } from '../users/user';

const communities: CommunityResponse[] = [
  {
    id: '123',
    title: 'group1',
    description: 'super group description',
    type: CommunityType.OPENED,
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

describe('CommunitiesComponent', () => {
  let component: CommunitiesComponent;
  let fixture: ComponentFixture<CommunitiesComponent>;

  const authenticatedUser: UserIdentity = {
    userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'tester',
    firstName: 'Toni',
    lastName: 'Tester',
    email: 'toni.tester@myskills.io',
    roles: ['ROLE_USER']
  };

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
            'deleteCommunity': of<void>(),
            'joinCommunity': of<CommunityResponse>({
              id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
              title: 'test1',
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
        {
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
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

  it('should make user join a community', fakeAsync(() => {
    component.joinCommunity({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'} as CommunityResponse);
    fixture.detectChanges();
    expect(component.isCommunityJoined({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'} as CommunityResponse)).toBe(true);
  }));

  it('should check if the user is manager of a community', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.isCommunityManager(communities[0])).toBe(true);
  }));

  it('should check if the user is not manager of a community', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.isCommunityManager(communities[1])).toBe(false);
  }));

});
