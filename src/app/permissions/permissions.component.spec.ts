import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsComponent } from './permissions.component';
import { UserPermissionScope } from '../users/user-permission-scope';
import { UsersService } from '../users/users.service';
import { of } from 'rxjs';
import { User } from '../users/user';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { Component, Input } from '@angular/core';
import { UserPermission } from '../users/user-permission';
import { UserPermissionRequest } from './user-permission-request';
import { GlobalUserPermission } from './global-user-permission';
import { GlobalUserPermissionResponse } from './global-user-permission-response';

const authorizedUsers: User[] = [
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'owner1',
    firstName: 'first',
    lastName: 'owner',
    email: 'first.owner@skoop.io'
  },
  {
    id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
    userName: 'owner2',
    firstName: 'second',
    lastName: 'owner',
    email: 'second.owner@skoop.io'
  }
];
const testPermissions: UserPermission[] = [
  {
    owner: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io'
    },
    scope: UserPermissionScope.READ_USER_SKILLS,
    authorizedUsers: [authorizedUsers[0]],
  },
  {
    owner: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'tester',
      firstName: 'Toni',
      lastName: 'Tester',
      email: 'toni.tester@skoop.io'
    },
    scope: UserPermissionScope.READ_USER_PROFILE,
    authorizedUsers: [authorizedUsers[1]],
  }
];

const globalPermissions: GlobalUserPermissionResponse[] = [
  {
    scope: UserPermissionScope.READ_USER_PROFILE,
    owner: {
      id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
      userName: 'owner2',
      firstName: 'second',
      lastName: 'owner',
      email: 'second.owner@skoop.io'
    }
  },
  {
    scope: UserPermissionScope.READ_USER_SKILLS,
    owner: {
      id: '666808eb-b6bd-447d-8dce-3e0d66b16666',
      userName: 'owner2',
      firstName: 'second',
      lastName: 'owner',
      email: 'second.owner@skoop.io'
    }
  }
];

@Component({
  selector: 'app-authorized-users-select',
  template: ''
})
class AuthorizedUsersSelectStubComponent {
  @Input() users = [];
  @Input() placeholder = '';
}

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ PermissionsComponent, AuthorizedUsersSelectStubComponent ],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj('userService', {
            'getPermissions': of<UserPermission[]>(testPermissions),
            'updatePermissions': of<UserPermission[]>(testPermissions),
            'getGlobalUserPermissions': of<GlobalUserPermissionResponse[]>(globalPermissions),
            'updateGlobalUserPermissions': of<GlobalUserPermissionResponse[]>(globalPermissions)
          })
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the list of authorized users', () => {
    expect(component.authorizedSkillsUsers).toEqual(testPermissions[0].authorizedUsers);
    expect(component.authorizedProfileUsers).toEqual(testPermissions[1].authorizedUsers);
  });

  it('should initialize global permissions', async() => {
    expect(component.allowAllToViewSkills.value).toBeTruthy();
    expect(component.allowAllToViewProfile.value).toBeTruthy();
    expect(component.allowToBeCoach.value).toBeFalsy();
  });

  it('should update the list of authorized to view skills users', async(() => {
    const newUser = {
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@skoop.io'
    };
    component.authorizedSkillsUsers.push(newUser);
    component.savePermissions();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.authorizedSkillsUsers).toEqual([authorizedUsers[0], newUser]);
      const userService: UsersService = TestBed.get(UsersService) as UsersService;
      const expectedRequest: UserPermissionRequest[] = [
        {
          scope: UserPermissionScope.READ_USER_SKILLS,
          authorizedUserIds: [authorizedUsers[0].id, newUser.id]
        },
        {
          scope: UserPermissionScope.READ_USER_PROFILE,
          authorizedUserIds: [authorizedUsers[1].id]
        }
      ];
      expect(userService.updatePermissions).toHaveBeenCalledWith(expectedRequest);
    });
  }));

  it('should update the list of authorized to view profile users', async(() => {
    const newUser = {
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@skoop.io'
    };
    component.authorizedSkillsUsers = [authorizedUsers[0]];
    component.authorizedProfileUsers = [authorizedUsers[1], newUser];
    component.savePermissions();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const userService: UsersService = TestBed.get(UsersService) as UsersService;
      const expectedRequest: UserPermissionRequest[] = [
        {
          scope: UserPermissionScope.READ_USER_SKILLS,
          authorizedUserIds: [authorizedUsers[0].id]
        },
        {
          scope: UserPermissionScope.READ_USER_PROFILE,
          authorizedUserIds: [authorizedUsers[1].id, newUser.id]
        }
      ];
      expect(userService.updatePermissions).toHaveBeenCalledWith(expectedRequest);
    });
  }));

  it('should update the list of global permissions', async(() => {
    component.allowToBeCoach.setValue(true);
    component.savePermissions();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const userService: UsersService = TestBed.get(UsersService) as UsersService;
      const expectedRequest: GlobalUserPermission[] = [
        {
          scope: UserPermissionScope.READ_USER_SKILLS,
        },
        {
          scope: UserPermissionScope.READ_USER_PROFILE,
        },
        {
          scope: UserPermissionScope.BE_COACH,
        }
      ];
      expect(userService.updateGlobalUserPermissions).toHaveBeenCalledWith(expectedRequest);
    });
  }));

});
