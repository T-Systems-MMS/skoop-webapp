import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityInvitationDialogComponent } from './community-invitation-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from '../communities/communities.service';
import { of } from 'rxjs';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

const communityId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';

const users: User[] = [{
  id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
  userName: 'testing',
  firstName: 'Tina',
  lastName: 'Testing',
  email: 'tina.testing@myskills.io',
  coach: false,
},
{
  id: '251c2a3b-b737-4622-8060-196d5e297ebc',
  userName: 'testbed',
  firstName: 'Tabia',
  lastName: 'Testbed',
  email: 'tabia.testbed@myskills.io',
  coach: false,
}];

describe('CommunityInvitationDialogComponent', () => {
  let component: CommunityInvitationDialogComponent;
  let fixture: ComponentFixture<CommunityInvitationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ CommunityInvitationDialogComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: CommunitiesService,
          useValue: jasmine.createSpyObj('communityService', {'inviteUsers': of<CommunityUserRegistrationResponse[]>()})
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('userService', {'getUserSuggestions': of<User[]>(users)})
        },
        {provide: MAT_DIALOG_DATA, useValue: {communityId: communityId}},
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityInvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call the service when list of users is empty', async(() => {
    const communityService: CommunitiesService = TestBed.get(CommunitiesService);

    component.inviteUsers();
    expect(communityService.inviteUsers).not.toHaveBeenCalled();
  }));

  it('should invite list of users', async(() => {
    const communityService: CommunitiesService = TestBed.get(CommunitiesService);
    component.usersArray.push(users[0]);
    component.usersArray.push(users[1]);
    component.inviteUsers();
    fixture.whenStable().then(() => {
      expect(communityService.inviteUsers).toHaveBeenCalledWith(
        communityId,
        [users[0].id, users[1].id]
      );
    });
  }));
});
