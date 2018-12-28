import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { UserProfileComponent } from './user-profile.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UsersService } from './users.service';
import { User } from './user';
import { UserPermissionScope } from './user-permission-scope';
import { UserRequest } from "./user-request";

const usersServiceStub: Partial<UsersService> = {
  getUser(): Observable<User> { return null; },
  updateUser(userData: UserRequest): Observable<User> { return null; },
  getAuthorizedUsers(scope: UserPermissionScope): Observable<User[]> { return null; },
  updateAuthorizedUsers(scope: UserPermissionScope, authorizedUsers: User[]): Observable<User[]> { return null; },
  getUserSuggestions(search: string): Observable<User[]> { return null;}
};

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(async(() => {
    spyOn(usersServiceStub, 'getUser')
      .and.returnValue(of<User>(
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'tester',
          firstName: 'Toni',
          lastName: 'Tester',
          email: 'toni.tester@myskills.io',
          academicDegree: 'academic degree',
          positionProfile: 'position profile',
          summary: 'summary',
          industrySectors: ['sector1', 'sector2', 'sector3'],
          specializations: ['specialization1, specialization2, specialization3'],
          certificates: ['certificate1', 'certificate2', 'certificate3'],
          languages: ['language1', 'language2', 'language2'],
          coach: false,
        }
      ));

    spyOn(usersServiceStub, 'getAuthorizedUsers')
      .and.returnValue(of<User[]>(
        [{
          id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
          userName: 'testing',
          firstName: 'Tina',
          lastName: 'Testing',
          email: 'tina.testing@myskills.io',
          coach: false,
        }]
      ));

    spyOn(usersServiceStub, 'updateUser')
      .and.returnValue(of<User>(
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'tester',
          firstName: 'Toni',
          lastName: 'Tester',
          email: 'toni.tester@myskills.io',
          coach: true,
        }
      ));

    spyOn(usersServiceStub, 'updateAuthorizedUsers')
      .and.returnValue(of<User[]>(
        [{
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
      declarations: [UserProfileComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: UsersService, useValue: usersServiceStub },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.errorMessage).toBeNull();
  });

  it('should render "User profile" as heading', () => {
    const heading: DebugElement = fixture.debugElement.query(By.css('h1'));
    expect(heading.nativeElement.innerText).toBe('User profile');
  });

  it('should initialize the user profile form', () => {
    expect(component.userForm.get('firstName').value).toBe('Toni');
    expect(component.userForm.get('lastName').value).toBe('Tester');
    expect(component.userForm.get('userName').value).toBe('tester');
    expect(component.userForm.get('email').value).toBe('toni.tester@myskills.io');
    expect(component.userForm.get('coach').value).toBeFalsy();
  });

  it('should initialize the list of authorized users', () => {
    expect(component.authorizedUsers).toEqual([{
      id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
      userName: 'testing',
      firstName: 'Tina',
      lastName: 'Testing',
      email: 'tina.testing@myskills.io',
      coach: false,
    }]);
  });

  it('should remove a given user from the list of authorized users', () => {
    component.authorizedUsers = [{
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
    component.onAuthorizedUserRemoved(component.authorizedUsers[0]);
    expect(component.authorizedUsers).toEqual([{
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@myskills.io',
      coach: false,
    }]);
  });

  it('should submit and update the user profile form', async(() => {
    component.userForm.get('coach').setValue(true);
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userForm.get('firstName').value).toBe('Toni');
      expect(component.userForm.get('lastName').value).toBe('Tester');
      expect(component.userForm.get('userName').value).toBe('tester');
      expect(component.userForm.get('email').value).toBe('toni.tester@myskills.io');
      expect(component.userForm.get('coach').value).toBeTruthy();

      const expectedRequestData: UserRequest = {
        userName: 'tester',
        academicDegree: 'academic degree',
        positionProfile: 'position profile',
        summary: 'summary',
        industrySectors: ['sector1', 'sector2', 'sector3'],
        specializations: ['specialization1, specialization2, specialization3'],
        certificates: ['certificate1', 'certificate2', 'certificate3'],
        languages: ['language1', 'language2', 'language2'],
        coach: true
      };

      expect(usersServiceStub.updateUser).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should submit and update the list of authorized users', async(() => {
    component.authorizedUsers.push({
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@myskills.io',
      coach: false,
    });
    component.onSubmit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.authorizedUsers).toEqual([{
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
      }]);

      expect(usersServiceStub.updateAuthorizedUsers).toHaveBeenCalledWith(
        UserPermissionScope.READ_USER_SKILLS,
        [{
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
        }]
      );
    });
  }));

  it('should send getUserSuggestions request in 500 ms', fakeAsync(() => {
    const usersService = TestBed.get(UsersService) as UsersService;
    spyOn(usersService, 'getUserSuggestions').and.returnValue(of([]));

    component.authorizedUsersControl.setValue('test');
    tick(200);
    fixture.detectChanges();

    expect(usersService.getUserSuggestions).not.toHaveBeenCalled();

    tick(300);
    fixture.detectChanges();
    expect(usersService.getUserSuggestions).toHaveBeenCalled();

    discardPeriodicTasks();
  }));

});
