import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityInvitationDialogComponent } from './community-invitation-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { User } from '../users/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { By } from '@angular/platform-browser';
import { CommunityUserService } from '../shared/community-user.service';

const communityId = 'e6b808eb-b6bd-447d-8dce-3e0d66b17759';

const users: User[] = [{
  id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
  userName: 'testing',
  firstName: 'Tina',
  lastName: 'Testing',
  email: 'tina.testing@skoop.io',
  coach: false,
},
{
  id: '251c2a3b-b737-4622-8060-196d5e297ebc',
  userName: 'testbed',
  firstName: 'Tabia',
  lastName: 'Testbed',
  email: 'tabia.testbed@skoop.io',
  coach: false,
}];

const communityUserRegistrations: CommunityUserRegistrationResponse[] = [
  {
    id: '12345',
    user: users[0],
    approvedByUser: false,
    approvedByCommunity: true
  },
  {
    id: '567890',
    user: users[1],
    approvedByUser: false,
    approvedByCommunity: true
  }
];

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
          provide: CommunityRegistrationService,
          useValue: jasmine.createSpyObj('registrationService',
            {
              'inviteUsers': of<CommunityUserRegistrationResponse[]>(communityUserRegistrations)
            })
        },
        {
          provide: CommunityUserService,
          useValue: jasmine.createSpyObj('communityUserService', {
            'getCommunityUserSuggestions': of<User[]>(users),
            'getRecommendedUsers': of<User[]>(users)
          })
        },
        {provide: MAT_DIALOG_DATA, useValue: {communityId: communityId}},
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('dialogRef', {'close': of<void>()}) },
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

  it('should disable button when there are no users to invite', async(() => {
    component.usersArray.splice(0, component.usersArray.length);

    const inviteButton = fixture.debugElement.query(By.css('#invitation-dialog-button'));
    expect(inviteButton.nativeElement.disabled).toBeTruthy();
  }));

  it('should invite list of users', async(() => {
    const communityService: CommunityRegistrationService = TestBed.get(CommunityRegistrationService);
    component.usersArray.push(users[0]);
    component.usersArray.push(users[1]);
    component.inviteUsers();
    fixture.whenStable().then(() => {
      expect(communityService.inviteUsers).toHaveBeenCalledWith(
        communityId,
        [users[0].id, users[1].id]
      );

      const dialogRef = TestBed.get(MatDialogRef);
      expect(dialogRef.close).toHaveBeenCalledWith([communityUserRegistrations[0].user, communityUserRegistrations[1].user]);
    });
  }));

  it('should add user from the list of recommended users', async(() => {
    expect(component.recommendedUsers).toEqual(users);
    expect(component.usersArray).toEqual([]);

    const recommendedUser: User = users[1];
    component.chooseRecommendedUser(recommendedUser);

    expect(component.recommendedUsers.length).toBe(1);
    expect(component.recommendedUsers).toContain(users[0]);
    expect(component.usersArray.length).toBe(1);
    expect(component.usersArray).toContain(recommendedUser);
  }));

  it('should not add already added user', async(() => {
    component.usersArray.push(users[0]);

    const recommendedUser: User = users[0];
    component.chooseRecommendedUser(recommendedUser);

    expect(component.usersArray.length).toBe(1);
    expect(component.usersArray).toContain(recommendedUser);
  }));
});
