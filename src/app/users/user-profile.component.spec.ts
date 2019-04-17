import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule} from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AppMaterialModule } from '../app-material.module';
import { UserProfileComponent } from './user-profile.component';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UsersService } from './users.service';
import { User } from './user';
import { UserPermissionScope } from './user-permission-scope';
import { UserRequest } from './user-request';
import { ENTER } from '@angular/cdk/keycodes';

const usersServiceStub: Partial<UsersService> = {
  getUser(): Observable<User> { return null; },
  updateUser(userData: UserRequest): Observable<User> { return null; },
  getAuthorizedUsers(scope: UserPermissionScope): Observable<User[]> { return null; },
  updateAuthorizedUsers(scope: UserPermissionScope, authorizedUsers: User[]): Observable<User[]> { return null; },
  getUserSuggestions(search: string): Observable<User[]> { return null; }
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
          email: 'toni.tester@skoop.io',
          academicDegree: 'academic degree',
          positionProfile: 'position profile',
          summary: 'summary',
          industrySectors: ['sector1', 'sector2', 'sector3'],
          specializations: ['specialization1', 'specialization2', 'specialization3'],
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
          email: 'tina.testing@skoop.io',
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
          email: 'toni.tester@skoop.io',
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
    expect(component.userForm.get('email').value).toBe('toni.tester@skoop.io');
    expect(component.userForm.get('academicDegree').value).toBe('academic degree');
    expect(component.userForm.get('positionProfile').value).toBe('position profile');
    expect(component.userForm.get('summary').value).toBe('summary');
    expect(component.userForm.get('industrySectors').value).toEqual(['sector1', 'sector2', 'sector3']);
    expect(component.userForm.get('specializations').value).toEqual(['specialization1', 'specialization2', 'specialization3']);
    expect(component.userForm.get('certificates').value).toEqual(['certificate1', 'certificate2', 'certificate3']);
    expect(component.userForm.get('languages').value).toEqual(['language1', 'language2', 'language2']);
    expect(component.userForm.get('coach').value).toBeFalsy();
  });

  it('should initialize the list of authorized users', () => {
    expect(component.authorizedUsers).toEqual([{
      id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
      userName: 'testing',
      firstName: 'Tina',
      lastName: 'Testing',
      email: 'tina.testing@skoop.io',
      coach: false,
    }]);
  });

  it('should remove a given user from the list of authorized users', () => {
    component.authorizedUsers = [{
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
    component.onAuthorizedUserRemoved(component.authorizedUsers[0]);
    expect(component.authorizedUsers).toEqual([{
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@skoop.io',
      coach: false,
    }]);
  });

  it('should update the user profile form', async(() => {
    component.userForm.get('coach').setValue(true);
    component.saveUserDetails();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.userForm.get('firstName').value).toBe('Toni');
      expect(component.userForm.get('lastName').value).toBe('Tester');
      expect(component.userForm.get('userName').value).toBe('tester');
      expect(component.userForm.get('email').value).toBe('toni.tester@skoop.io');
      expect(component.userForm.get('coach').value).toBeTruthy();

      const expectedRequestData: UserRequest = {
        userName: 'tester',
        academicDegree: 'academic degree',
        positionProfile: 'position profile',
        summary: 'summary',
        industrySectors: ['sector1', 'sector2', 'sector3'],
        specializations: ['specialization1', 'specialization2', 'specialization3'],
        certificates: ['certificate1', 'certificate2', 'certificate3'],
        languages: ['language1', 'language2', 'language2'],
        coach: true
      };

      expect(usersServiceStub.updateUser).toHaveBeenCalledWith(expectedRequestData);
    });
  }));

  it('should update the list of authorized users', async(() => {
    component.authorizedUsers.push({
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
      expect(component.authorizedUsers).toEqual([{
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

  it('should add new elem to the language array', () => {
    const value = 'new language';
    expect(component.languagesArray.indexOf(value)).toBe(-1);

    const languageDebugElement = fixture.debugElement.query(By.css('#languageChipList'));
    const inputNativeElement = languageDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(component.languagesArray.indexOf(value)).not.toBe(-1);
  });

  it('should not add a duplicate elem to the language array', () => {
    const expectedSize = component.languagesArray.length;
    const value = component.languagesArray[0];
    const pushSpy = spyOn(component.languagesArray, 'push');

    const languageDebugElement = fixture.debugElement.query(By.css('#languageChipList'));
    const inputNativeElement = languageDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(pushSpy).not.toHaveBeenCalled();
    // size wasn't changed
    expect(component.languagesArray.length).toBe(expectedSize);
  });

  it('should remove elem from the language array', () => {
    const valueForRemoving = component.languagesArray[0];
    component.removeElem(0, component.languagesArray);
    expect(component.languagesArray.indexOf(valueForRemoving)).toBe(-1);
  });

});
