import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from './user';
import { UsersService } from './users.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserPermissionScope } from './user-permission-scope';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { UserRequest } from "./user-request";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup = null;
  authorizedUsers: User[] = [];
  authorizedUsersControl = new FormControl();
  authorizedUserSuggestions$: Observable<User[]>;
  errorMessage: string = null;
  dataAvailable = false;

  elemSelectable = false;
  elemRemovable = true;
  elemAddOnBlur = false;
  elemSeparatorKeysCodes = [ENTER, COMMA];

  @ViewChild('authorizedUsersInput') authorizedUsersInput: ElementRef<HTMLInputElement>;
  @ViewChild('authorizedUsersAutocomplete') matAutocomplete: MatAutocomplete;

  constructor(private usersService: UsersService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
    this.userForm = this.formBuilder.group({
      userName: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      academicDegree: new FormControl(),
      positionProfile: new FormControl(),
      summary: new FormControl(),
      industrySectors: new FormArray([]),
      specializations: new FormArray([]),
      certificates: new FormArray([]),
      languages: new FormArray([]),
      coach: new FormControl(),
    });
    this.authorizedUserSuggestions$ = this.authorizedUsersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(search => this.usersService.getUserSuggestions(search))
    );
  }

  ngOnInit(): void {
    this.loadUser();
    this.loadAuthorizedUsers();
  }

  private loadUser(): void {
    this.usersService.getUser()
      .subscribe(user => {
        this.updateUserForm(user);
        this.dataAvailable = true;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  private loadAuthorizedUsers(): void {
    this.usersService.getAuthorizedUsers(UserPermissionScope.READ_USER_SKILLS)
      .subscribe(authorizedUsers => {
        this.authorizedUsers = authorizedUsers;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  private updateUserForm(user: User): void {
    this.userForm.setValue({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      // TODO: academicDegree: user.academicDegree
      academicDegree: null,
      positionProfile: null,
      summary: null,
      industrySectors: [],
      specializations: [],
      certificates: [],
      languages: [],
      coach: user.coach,
    });
  }

  onAuthorizedUserSuggestionSelected(event: MatAutocompleteSelectedEvent): void {
    this.authorizedUsers.push(event.option.value);
    this.authorizedUsersInput.nativeElement.value = '';
    this.authorizedUsersControl.setValue(null);
  }

  onAuthorizedUserRemoved(user: User): void {
    const index = this.authorizedUsers.indexOf(user);
    if (index >= 0) {
      this.authorizedUsers.splice(index, 1);
    }
  }

  onSubmit() {
    this.usersService.updateUser(this.buildUserRequestData()).subscribe(
      user => {
        this.updateUserForm(user);
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      }
    );
    this.usersService.updateAuthorizedUsers(UserPermissionScope.READ_USER_SKILLS, this.authorizedUsers)
      .subscribe(authorizedUsers => {
        this.authorizedUsers = authorizedUsers;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  addElem(event: MatChipInputEvent, control: FormArray) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      control.push(this.formBuilder.control(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeElem(index: number, control: FormArray) {
    control.removeAt(index);
  }

  private buildUserRequestData(): UserRequest {
    return {
      userName: this.userForm.get('userName').value,
      academicDegree: this.userForm.get('academicDegree').value,
      positionProfile: this.userForm.get('positionProfile').value,
      summary: this.userForm.get('summary').value,
      industrySectors: this.industrySectorsControl.value,
      specializations: this.specializationsControl.value,
      certificates: this.certificatesControl.value,
      languages: this.languagesControl.value,
      coach: this.userForm.get('coach').value
    } as UserRequest;
  }

  get industrySectorsControl(): FormArray {
    return this.userForm.get('industrySectors') as FormArray;
  }

  get specializationsControl(): FormArray {
    return this.userForm.get('specializations') as FormArray;
  }

  get certificatesControl(): FormArray {
    return this.userForm.get('certificates') as FormArray;
  }

  get languagesControl(): FormArray {
    return this.userForm.get('languages') as FormArray;
  }
}
