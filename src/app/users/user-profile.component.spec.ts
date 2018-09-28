import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, AbstractControl, Validators } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UsersService } from './users.service';
import { User } from './user';
import { Observable, of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const usersServiceStub: Partial<UsersService> = {
  getUser(): Observable<User> { return null; },
  updateUser(userName: string, coach: boolean): Observable<User> { return null; },
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
          firstName: 'testername'
        }
      ));

    spyOn(usersServiceStub, 'updateUser')
      .and.returnValue(of<User>(
        {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          userName: 'tester',
          firstName: 'testername',
          coach: true,
        }
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
  });

  it('should initialize properties', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.userForm).toBeTruthy();
    expect(component.errorMessage).toBeNull();
  });

  it('userName field required with blank validity', () => {
    const userNameField: AbstractControl = component.userForm.controls['userName'];
    userNameField.setValue('');
    const errors = userNameField.errors || {};
    expect(errors['required']).toBeDefined('required validator not triggered');
    expect(errors['minlength']).toBeUndefined('min length validator was triggered');
    expect(userNameField.valid).toBeFalsy();
    expect(component.userForm.valid).toBeFalsy();
  });

  it('userName field min length too short validity', () => {
    const userNameField: AbstractControl = component.userForm.controls['userName'];
    userNameField.setValue('1');
    const errors = userNameField.errors || {};
    expect(errors['required']).toBeUndefined('required validator was triggered');
    expect(errors['minlength']).toBeDefined('min length validator not triggered');
    expect(userNameField.valid).toBeFalsy();
    expect(component.userForm.valid).toBeFalsy();
  });

  it('userName field is valid', () => {
    const userNameField: AbstractControl = component.userForm.controls['userName'];
    userNameField.setValue('tester');
    const errors = userNameField.errors || {};
    expect(errors['required']).toBeUndefined();
    expect(errors['minlength']).toBeUndefined();
    expect(userNameField.valid).toBeTruthy();
    expect(component.userForm.valid).toBeTruthy();
  });

  it('should show "User profile" as heading', async(() => {
    const h1DebugElement: DebugElement = fixture.debugElement.query(By.css('h1'));
    expect(h1DebugElement.nativeElement.innerText).toBe('User profile');
  }));

  it('updating a user profile', () => {
    expect(component.userForm.controls['coach'].value).toBeNull();

    component.onSubmit();

    // Now we can check to make sure the user profile has updated
    expect(component.userForm.controls['$id'].value).toBe('e6b808eb-b6bd-447d-8dce-3e0d66b17759');
    expect(component.userForm.controls['userName'].value).toBe('tester');
    expect(component.userForm.controls['firstName'].value).toBe('testername');
    expect(component.userForm.controls['coach'].value).toBe(true);
  });
});
