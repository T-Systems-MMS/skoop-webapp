import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { User } from '../users/user';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { UserPermissionScope } from '../users/user-permission-scope';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  errorMessage: string = null;

  authorizedUsers: User[] = [];
  authorizedUsersControl = new FormControl();
  authorizedUserSuggestions$: Observable<User[]>;

  @ViewChild('authorizedUsersInput') authorizedUsersInput: ElementRef<HTMLInputElement>;
  @Input() savingInProgress: boolean;

  constructor(private usersService: UsersService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
    this.authorizedUserSuggestions$ = this.authorizedUsersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(search => this.usersService.getUserSuggestions(search))
    );
  }

  ngOnInit() {
    this.loadAuthorizedUsers();
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

  savePermissions() {
    this.savingInProgress = true;
    this.usersService.updateAuthorizedUsers(UserPermissionScope.READ_USER_SKILLS, this.authorizedUsers)
      .pipe(
        finalize( () => {
            this.savingInProgress = false;
          }
        )
      )
      .subscribe(authorizedUsers => {
        this.authorizedUsers = authorizedUsers;
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

}
