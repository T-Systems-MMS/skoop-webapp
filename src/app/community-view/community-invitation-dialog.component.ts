import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatDialogRef
} from '@angular/material';
import { Observable } from 'rxjs';
import { User } from '../users/user';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../users/users.service';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { CommunitiesService } from '../communities/communities.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-community-invitation-dialog',
  templateUrl: './community-invitation-dialog.component.html',
  styleUrls: ['./community-invitation-dialog.component.scss']
})
export class CommunityInvitationDialogComponent implements OnInit {

  @ViewChild('usersInput') usersAutocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('usersAutocomplete') usersMatAutocomplete: MatAutocomplete;

  errorMessage: string = null;
  invitationForm: FormGroup;
  userSuggestions$: Observable<User[]>;
  usersControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: InvitationDialogData,
              public dialogRef: MatDialogRef<CommunityInvitationDialogComponent>,
              private usersService: UsersService,
              private communityService: CommunitiesService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.loadUsers();
    this.invitationForm = this.formBuilder.group({
      invitedUsers: new FormControl([])
    });
  }

  addSelectedUser(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (value && this.usersArray.indexOf(value) === -1) {
      this.usersArray.push(value);
    }

    this.usersAutocompleteInput.nativeElement.value = '';
    this.usersControl.setValue(null);
  }

  removeUser(user: User): void {
    const index = this.usersArray.indexOf(user);
    if (index >= 0) {
      this.usersArray.splice(index, 1);
    }
  }

  inviteUsers() {
    if (!this.usersArray || this.usersArray.length === 0) {
      return;
    }

    this.communityService.inviteUsers(this.dialogData.communityId, this.usersArray.map(item => item.id))
      .subscribe(() => {
        this.dialogRef.close();
      }, errorResponse => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  cancel() {
    this.dialogRef.close();
  }

  private loadUsers() {
    this.userSuggestions$ = this.usersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(search => this.usersService.getUserSuggestions(search))
    );
  }

  get usersArray(): User[] {
    return this.invitationForm.get('invitedUsers').value;
  }

}

export interface InvitationDialogData {
  communityId: string;
}
