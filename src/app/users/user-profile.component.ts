import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { User } from './user';
import { UsersService } from './users.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserPermissionScope } from './user-permission-scope';

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
      coach: new FormControl(),
    });
    this.authorizedUserSuggestions$ = this.authorizedUsersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
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
    this.usersService.updateUser(
      this.userForm.get('userName').value,
      this.userForm.get('coach').value
    ).subscribe(
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
}
