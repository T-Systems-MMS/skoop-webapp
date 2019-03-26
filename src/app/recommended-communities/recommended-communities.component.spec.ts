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
import { InfoDialogComponent } from '../shared/info-dialog/info-dialog.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { CommunityUserResponse } from '../communities/community-user-response';
import { CommunityRole } from '../communities/community-role.enum';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';

const communities: CommunityResponse[] = [
  {
    id: '123',
    title: 'group1',
    description: 'super group description',
    type: CommunityType.OPEN,
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
    managers: [
      {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        userName: 'tester'
      } as User
    ]
  } as CommunityResponse,
  {
    id: '123456',
    title: 'group2',
    description: 'other group',
    type: CommunityType.OPEN,
    managers: [
      {
        id: 'c6d8badc-0f80-4d20-b436-0e7e871f97f5',
        userName: 'anotherTester'
      } as User
    ]
  } as CommunityResponse
];

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@myskills.io',
  roles: ['ROLE_USER']
};

const currentUser = {
  id: authenticatedUser.userId,
  userName: authenticatedUser.userName,
  firstName: authenticatedUser.firstName,
  lastName: authenticatedUser.lastName,
  email: authenticatedUser.email,
  coach: false,
};

const communityUserRegistrations: CommunityUserRegistrationResponse[] = [
  {
    user: currentUser,
    approvedByUser: true,
    approvedByCommunity: true
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
      declarations: [ RecommendedCommunitiesComponent, CommunityCardComponent, InfoDialogComponent ],
      providers: [
        {
          provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {
            'getRecommendedCommunities': of<Community[]>(communities),
            'joinCommunity': of<CommunityResponse>({
              id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
              title: 'test1',
              type: CommunityType.OPEN,
              description: 'description1',
              links: [{
                name: 'google',
                href: 'https://www.google.com'
              },
                {
                  name: 'stackoveflow',
                  href: 'https://stackoverflow.com/'
                }],
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
            } as CommunityResponse)
          })
        },
        {
          provide: CommunityRegistrationService,
          useValue: jasmine.createSpyObj('registrationService',
            {
              'inviteUsers': of<CommunityUserRegistrationResponse[]>(communityUserRegistrations)
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
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [InfoDialogComponent]
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

  it('should remove the community form the list of recommended communities when user has joined to it', fakeAsync(() => {
    const communityToJoin = communities[1];
    expect(component.communities).toContain(communityToJoin);

    component.joinCommunity(communityToJoin);
    fixture.detectChanges();
    expect(component.communities).not.toContain(communityToJoin);
  }));


  it('should display closed community info dialog', fakeAsync(() => {
    const communityUserResponse = {
      role: CommunityRole.MEMBER,
      user: {
        id: '123',
        userName: 'tester'
      } as User
    } as CommunityUserResponse;
    const communityService = TestBed.get(CommunitiesService) as CommunitiesService;
    communityService.joinCommunity = jasmine.createSpy().and.returnValue(of(communityUserResponse));

    const registrationService = TestBed.get(CommunityRegistrationService) as CommunityRegistrationService;

    const closedCommunity = {id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f', type: CommunityType.CLOSED} as CommunityResponse;
    component.joinCommunity(closedCommunity);
    fixture.detectChanges();

    const matDialog: MatDialog = TestBed.get(MatDialog);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(InfoDialogComponent));

    expect(registrationService.inviteUsers).toHaveBeenCalledWith(closedCommunity.id, [authenticatedUser.userId]);
  }));
});
