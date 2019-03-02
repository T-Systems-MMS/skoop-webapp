import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { CommunityViewComponent } from './community-view.component';
import { AppMaterialModule } from '../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { UserIdentity } from '../shared/user-identity';
import { CommunityResponse } from '../communities/community-response';
import { CommunityType } from '../communities/community-type.enum';
import { User } from '../users/user';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from '../communities/communities.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { ClosedCommunityInfoDialogComponent } from '../shared/closed-community-info-dialog/closed-community-info-dialog.component';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@myskills.io',
  roles: ['ROLE_USER']
};

const userForKicking = {
  id: 'e6b808eb-b6bd-447d-8dce-3e0d66b11234',
  userName: 'mustBeKickedOut',
  firstName: 'kick',
  lastName: 'me'
} as User;

const community: CommunityResponse = {
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
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666',
      userName: 'tester'
    } as User,
    userForKicking
  ],
  managers: [
    {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666',
      userName: 'tester'
    } as User
  ]
};

describe('CommunityViewComponent', () => {
  let component: CommunityViewComponent;
  let fixture: ComponentFixture<CommunityViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [CommunityViewComponent, DeleteConfirmationDialogComponent, ClosedCommunityInfoDialogComponent],
      providers: [
        {
          provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {
            'getCommunity': of(community),
            'leaveCommunity': of<CommunityResponse>({
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
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}],
              members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}]
            } as CommunityResponse),
            'joinCommunity': of<CommunityResponse>({
              id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
              title: 'test1',
              description: 'description1',
              type: CommunityType.OPENED,
              links: [{
                name: 'google',
                href: 'https://www.google.com'
              },
                {
                  name: 'stackoveflow',
                  href: 'https://stackoverflow.com/'
                }],
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}],
              members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}]
            } as CommunityResponse),
            'removeMember': of<CommunityResponse>({
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
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}],
              members: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}]
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
          entryComponents: [DeleteConfirmationDialogComponent, ClosedCommunityInfoDialogComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the user is not a member of community', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.isCommunityMember).toBeFalsy();
  }));

  it('should make user join a community', fakeAsync(() => {
    component.joinCommunity();
    fixture.detectChanges();
    expect(component.isCommunityMember).toBeTruthy();
  }));

  it('should hide a remove button when current user is not a manager', () => {
    component.isCommunityManager = false;
    expect(component.canRemoveMember(userForKicking)).toBeFalsy();
  });

  it('should kick out a community member ', fakeAsync(() => {
    component.isCommunityManager = true;
    const matDialog: MatDialog = TestBed.get(MatDialog);

    expect(component.canRemoveMember(userForKicking)).toBeTruthy();
    component.removeMember(userForKicking);
    fixture.detectChanges();

    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
  }));

  it('should make user leave a community', fakeAsync(() => {
    expect(component.canLeaveCommunity).toBeTruthy();
    component.leaveCommunity();
    fixture.detectChanges();
    expect(component.isCommunityMember).toBeFalsy();
  }));

  it('should not make user join a closed community', fakeAsync(() => {
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

    component.joinCommunity();
    fixture.detectChanges();
    expect(component.isCommunityMember).toBeFalsy();

    const matDialog: MatDialog = TestBed.get(MatDialog);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(ClosedCommunityInfoDialogComponent));
  }));
});
