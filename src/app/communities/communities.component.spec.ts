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
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { InfoDialogComponent } from '../shared/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material';
import { CommunityUserResponse } from './community-user-response';
import { CommunityRole } from './community-role.enum';
import { CommunityCardComponent } from '../shared/community-card/community-card.component';
import { Component } from '@angular/core';

const communities: CommunityResponse[] = [
  {
    id: '123',
    title: 'group1',
    description: 'super group description',
    type: CommunityType.OPEN,
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
  },
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
  }
];

@Component({
  selector: 'app-recommended-communities',
  template: ''
})
class RecommendedCommunitiesStubComponent {
}

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
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [
        CommunitiesComponent,
        CommunitiesFilterPipe,
        InfoDialogComponent,
        CommunityCardComponent,
        RecommendedCommunitiesStubComponent],
      providers: [
        {
          provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {
            'getCommunities': of<Community[]>(communities),
            'getUserCommunities': of<CommunityResponse[]>(
              [
                {
                  id: '123',
                  title: 'Java User Group',
                  type: CommunityType.OPEN
                } as CommunityResponse,
                {
                  id: '456',
                  title: 'Scala User Group'
                } as CommunityResponse
              ]
            ),
            'deleteCommunity': of<void>(),
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
    fixture = TestBed.createComponent(CommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the list of communities', fakeAsync(() => {
    fixture.detectChanges();
    const communitiesCards = fixture.debugElement.queryAll(By.css(('.community-card')));

    expect(communitiesCards.length).toBe(2);
    expect(communitiesCards[0].query(By.css('.community-card__heading')).nativeElement.textContent).toContain(communities[0].title);
    expect(communitiesCards[1].query(By.css('.community-card__heading')).nativeElement.textContent).toContain(communities[1].title);
  }));

  it('should make user join a community', fakeAsync(() => {
    component.joinCommunity({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'} as CommunityResponse);
    fixture.detectChanges();
    expect(component.isCommunityJoined({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'} as CommunityResponse)).toBeTruthy();
  }));

  it('should not make user join a closed community and display closed community info dialog', fakeAsync(() => {
    const response = {
      role: CommunityRole.MEMBER,
      user: {
        id: authenticatedUser.userId,
        userName: authenticatedUser.userName
      } as User
    } as CommunityUserResponse;

    const communityService = TestBed.get(CommunitiesService) as CommunitiesService;
    communityService.joinCommunity = jasmine.createSpy().and.returnValue(of(response));

    component.joinCommunity({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f', type: CommunityType.CLOSED} as CommunityResponse);
    fixture.detectChanges();
    expect(component.isCommunityJoined({id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'} as CommunityResponse)).toBeFalsy();

    const matDialog: MatDialog = TestBed.get(MatDialog);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(InfoDialogComponent));
  }));

  it('should check if the user is manager of a community', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.isCommunityManager(communities[0])).toBeTruthy();
  }));

  it('should check if the user is not manager of a community', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.isCommunityManager(communities[1])).toBeFalsy();
  }));

});
