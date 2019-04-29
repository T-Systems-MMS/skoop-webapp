import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from '../../users/user';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-authorized-users-select',
  templateUrl: './authorized-users-select.component.html',
  styleUrls: ['./authorized-users-select.component.scss']
})
export class AuthorizedUsersSelectComponent implements OnInit {

  authorizedUsersControl = new FormControl();
  authorizedUserSuggestions$: Observable<User[]>;

  @ViewChild('authorizedUsersInput') authorizedUsersInput: ElementRef<HTMLInputElement>;
  @Input('users') users: User[];
  @Input('placeholder') placeholder: string;

  constructor(private usersService: UsersService) {
    this.authorizedUserSuggestions$ = this.authorizedUsersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(search => this.usersService.getUserSuggestions(search))
    );
  }

  ngOnInit() {
  }

  onAuthorizedUserSuggestionSelected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    this.authorizedUsersInput.nativeElement.value = '';
    this.authorizedUsersControl.setValue(null);
  }

  onAuthorizedUserRemoved(user: User): void {
    const index = this.users.indexOf(user);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

}
