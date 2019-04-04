import { async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

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
import { InfoDialogComponent } from '../shared/info-dialog/info-dialog.component';
import { CommunityUserResponse } from '../communities/community-user-response';
import { CommunityRole } from '../communities/community-role.enum';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';

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
      id: authenticatedUser.userId,
      userName: authenticatedUser.userName
    } as User,
    {
      id: '123456',
      userName: 'manager to lower'
    } as User
  ]
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
    id: '123',
    user: currentUser,
    approvedByUser: true,
    approvedByCommunity: null
  }
];

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
      declarations: [CommunityViewComponent, DeleteConfirmationDialogComponent, InfoDialogComponent],
      providers: [
        {
          provide: CommunitiesService, useValue: jasmine.createSpyObj('communityService', {
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
            'getCommunityUsers': of<CommunityUserResponse[]>(
              [
                {
                  user: {
                    id: authenticatedUser.userId,
                    userName: 'tester'
                  } as User,
                  role: CommunityRole.MANAGER
                } as CommunityUserResponse,
                {
                  user: {
                    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666',
                    userName: 'manager'
                  } as User,
                  role: CommunityRole.MANAGER
                } as CommunityUserResponse,
                {
                  user: userForKicking,
                  role: CommunityRole.MEMBER
                } as CommunityUserResponse
              ]
            ),
            'getCommunity': of(community),
            'leaveCommunity': of<void>(),
            'joinCommunity': of<CommunityResponse>({
              id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
              title: 'test1',
              description: 'description1',
              type: CommunityType.OPEN,
              links: [{
                name: 'google',
                href: 'https://www.google.com'
              },
                {
                  name: 'stackoveflow',
                  href: 'https://stackoverflow.com/'
                }],
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}]
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
              managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17666'}]
            } as CommunityResponse),
            'changeUserRole': of<CommunityUserResponse>({
              user: {
                id: 'e6b808eb-b6bd-447d-8dce-3e0d66b11234',
                userName: 'tester',
                firstName: 'test',
                lastName: 'tester'
              } as User,
              role: CommunityRole.MANAGER
            })
          })
        },
        {
          provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })
        },
        {
          provide: CommunityRegistrationService,
          useValue: jasmine.createSpyObj('registrationService',
            {
              'inviteUsers': of<CommunityUserRegistrationResponse[]>(communityUserRegistrations)
            })
        },
        GlobalErrorHandlerService
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [DeleteConfirmationDialogComponent, InfoDialogComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if the user is not a member of community', fakeAsync(() => {
    const notMember: UserIdentity = {
      userId: 'g5b808eb-b6bd-447d-8dce-3e0d66b112345',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@myskills.io',
      roles: ['ROLE_USER']
    };
    const userService = TestBed.get(UserIdentityService) as UserIdentityService;
    userService.getUserIdentity = jasmine.createSpy().and.returnValue(of(notMember));
    fixture.detectChanges();
    expect(component.isCommunityMember).toBeFalsy();
  }));

  it('should make user join a community', fakeAsync(() => {
    const notMember: UserIdentity = {
      userId: 'g5b808eb-b6bd-447d-8dce-3e0d66b112345',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@myskills.io',
      roles: ['ROLE_USER']
    };
    const userService = TestBed.get(UserIdentityService) as UserIdentityService;
    userService.getUserIdentity = jasmine.createSpy().and.returnValue(of(notMember));

    fixture.detectChanges();
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

  it('should open a dialog to confirm user leaves a community', fakeAsync(() => {
    expect(component.canLeaveCommunity).toBeTruthy();
    component.leaveCommunity();
    fixture.detectChanges();
    const matDialog: MatDialog = TestBed.get(MatDialog);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
  }));

  it('should not make user join a closed community and display closed community info dialog', fakeAsync(() => {
    const communityUserResponse = {
      role: CommunityRole.MEMBER,
      user: {
        id: authenticatedUser.userId,
        userName: authenticatedUser.userName
      } as User
    } as CommunityUserResponse;
    const closedCommunity: CommunityResponse = Object.assign({}, component.community);
    closedCommunity.type = CommunityType.CLOSED;

    const communityService = TestBed.get(CommunitiesService) as CommunitiesService;
    communityService.getCommunity = jasmine.createSpy().and.returnValue(of(closedCommunity));
    communityService.joinCommunity = jasmine.createSpy().and.returnValue(of(communityUserResponse));

    const registrationService = TestBed.get(CommunityRegistrationService) as CommunityRegistrationService;
    const notMember: UserIdentity = {
      userId: 'g5b808eb-b6bd-447d-8dce-3e0d66b112345',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@myskills.io',
      roles: ['ROLE_USER']
    };
    const userService = TestBed.get(UserIdentityService) as UserIdentityService;
    userService.getUserIdentity = jasmine.createSpy().and.returnValue(of(notMember));
    fixture.detectChanges();

    component.joinCommunity();
    expect(component.isCommunityMember).toBeFalsy();

    const matDialog: MatDialog = TestBed.get(MatDialog);
    expect(matDialog.openDialogs.length).toBe(1);
    expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(InfoDialogComponent));

    expect(registrationService.inviteUsers).toHaveBeenCalledWith(component.community.id, [notMember.userId]);
  }));

  it('should allow user to invite other users', () => {
    fixture.detectChanges();
    expect(component.canInviteUsers).toBeTruthy();
  });

  it('should allow manager to change user role', fakeAsync(() => {
    fixture.detectChanges();
    expect(component.canChangeRole(component.communityMembers[0].user)).toBeTruthy();
  }));

  it('should raise member to manager', fakeAsync(() => {
    fixture.detectChanges();
    const userToRaise = component.communityMembers[0].user;

    const communityService = TestBed.get(CommunitiesService) as CommunitiesService;
    communityService.changeUserRole = jasmine.createSpy().and.returnValue(of({
      user: userToRaise,
      role: CommunityRole.MANAGER
    }));

    component.promoteToManager(userToRaise);

    expect(component.communityMembers.length).toBe(0);
    expect(component.community.managers).toContain(userToRaise);
  }));

  it('should lower a manager to member', fakeAsync(() => {
    fixture.detectChanges();
    const managerCount = component.community.managers.length;
    const userToLower = component.community.managers[1];

    const communityService = TestBed.get(CommunitiesService) as CommunitiesService;
    const expectedResponse = {
      user: userToLower,
      role: CommunityRole.MEMBER
    };
    communityService.changeUserRole = jasmine.createSpy().and.returnValue(of(expectedResponse));

    component.demoteToMember(userToLower);

    expect(component.communityMembers).toContain(expectedResponse);
    expect(component.community.managers.length).toBe(managerCount - 1);
  }));
});
