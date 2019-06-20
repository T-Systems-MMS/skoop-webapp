import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../users/user';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { CommunityUserRegistrationResponse } from '../shared/community-user-registration-response';
import { CommunityUserService } from '../shared/community-user.service';

@Component({
  selector: 'app-community-invitation-dialog',
  templateUrl: './community-invitation-dialog.component.html',
  styleUrls: ['./community-invitation-dialog.component.scss']
})
export class CommunityInvitationDialogComponent implements OnInit {

  @ViewChild('usersInput', { static: true }) usersAutocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('usersAutocomplete', { static: true }) usersMatAutocomplete: MatAutocomplete;

  errorMessage: string = null;
  invitationForm: FormGroup;
  userSuggestions$: Observable<User[]>;
  recommendedUsers: User[] = [];
  usersControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: InvitationDialogData,
              public dialogRef: MatDialogRef<CommunityInvitationDialogComponent>,
              private communityUserService: CommunityUserService,
              private registrationService: CommunityRegistrationService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRecommendedUsers();
    this.invitationForm = this.formBuilder.group({
      invitedUsers: new FormControl([])
    });
  }

  addSelectedUser(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (value && !this.existsInUsersArray(value)) {
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
    this.registrationService.inviteUsers(this.dialogData.communityId, this.usersArray.map(item => item.id))
      .subscribe((data: CommunityUserRegistrationResponse[]) => {
        this.dialogRef.close(data.map(item => item.user));
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  usersCanBeInvited(): boolean {
    return this.usersArray && this.usersArray.length > 0;
  }

  chooseRecommendedUser(user: User) {
    const index = this.recommendedUsers.indexOf(user);
    if (index >= 0) {
      this.recommendedUsers.splice(index, 1);
    }

    if (user && !this.existsInUsersArray(user)) {
      this.usersArray.push(user);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  private loadUsers() {
    this.userSuggestions$ = this.usersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(search => this.communityUserService.getCommunityUserSuggestions(this.dialogData.communityId, search))
    );
  }

  private loadRecommendedUsers() {
    this.communityUserService.getRecommendedUsers(this.dialogData.communityId)
      .subscribe(users => {
        this.recommendedUsers = users;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private handleErrorResponse(errorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  private existsInUsersArray(user: User): boolean {
    return this.usersArray.some(item => item.id === user.id);
  }

  get usersArray(): User[] {
    return this.invitationForm.get('invitedUsers').value;
  }

}

export interface InvitationDialogData {
  communityId: string;
}
