import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsComponent } from './permissions.component';
import { UserPermissionScope } from '../users/user-permission-scope';
import { UsersService } from '../users/users.service';
import { Observable, of } from 'rxjs';
import { User } from '../users/user';
import { UserRequest } from '../users/user-request';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { Component, Input } from '@angular/core';

const usersServiceStub: Partial<UsersService> = {
  getUser(): Observable<User> { return null; },
  updateUser(userData: UserRequest): Observable<User> { return null; },
  getAuthorizedUsers(scope: UserPermissionScope): Observable<User[]> { return null; },
  updateAuthorizedUsers(scope: UserPermissionScope, authorizedUsers: User[]): Observable<User[]> { return null; },
  getUserSuggestions(search: string): Observable<User[]> { return null; }
};

@Component({
  selector: 'app-authorized-users-select',
  template: ''
})
class AuthorizedUsersSelectStubComponent {
  @Input('users') users = [];
}

describe('PermissionsComponent', () => {
  let component: PermissionsComponent;
  let fixture: ComponentFixture<PermissionsComponent>;

  beforeEach(async(() => {
    spyOn(usersServiceStub, 'getAuthorizedUsers')
      .and.returnValue(of<User[]>(
      [{
        id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@skoop.io',
        coach: false,
      }]
    ));

    spyOn(usersServiceStub, 'updateAuthorizedUsers')
      .and.returnValue(of<User[]>(
      [{
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
        }]
    ));
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
        { provide: UsersService, useValue: usersServiceStub }
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
    expect(component.authorizedSkillsUsers).toEqual([{
      id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
      userName: 'testing',
      firstName: 'Tina',
      lastName: 'Testing',
      email: 'tina.testing@skoop.io',
      coach: false,
    }]);
  });

  it('should update the list of authorized users', async(() => {
    component.authorizedSkillsUsers.push({
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@skoop.io',
      coach: false,
    });
    component.savePermissions();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.authorizedSkillsUsers).toEqual([{
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
        }]);

      expect(usersServiceStub.updateAuthorizedUsers).toHaveBeenCalledWith(
        UserPermissionScope.READ_USER_SKILLS,
        [{
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
          }]
      );
    });
  }));

});
