import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { User } from './user';
import { UsersService } from './users.service';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UserRequest } from './user-request';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup = null;

  errorMessage: string = null;
  dataAvailable = false;

  savingInProgress = false;

  elemSelectable = false;
  elemRemovable = true;
  elemAddOnBlur = false;
  elemSeparatorKeysCodes = [ENTER, COMMA];

  @ViewChild('authorizedUsersAutocomplete', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private usersService: UsersService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private popupNotificationService: PopupNotificationService,
    private globalErrorHandlerService: GlobalErrorHandlerService) {
    this.userForm = this.formBuilder.group({
      userName: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      academicDegree: new FormControl(),
      positionProfile: new FormControl(),
      summary: new FormControl(),
      industrySectors: new FormControl([]),
      specializations: new FormControl([]),
      certificates: new FormControl([]),
      languages: new FormControl([])
    });
  }

  ngOnInit(): void {
    this.loadUser();
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

  private updateUserForm(user: User): void {
    this.userForm.patchValue({
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      academicDegree: user.academicDegree,
      positionProfile: user.positionProfile,
      summary: user.summary,
      industrySectors: user.industrySectors || [],
      specializations: user.specializations || [],
      certificates: user.certificates || [],
      languages: user.languages || []
    });
  }

  saveUserDetails() {
    this.savingInProgress = true;
    this.usersService.updateUser(this.buildUserRequestData())
      .pipe(
        finalize( () => {
          this.savingInProgress = false;
          }
        )
      )
      .subscribe(
      user => {
        this.updateUserForm(user);
        this.popupNotificationService.showSuccessMessage('User profile was saved successfully');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      }
    );
  }

  addElem(event: MatChipInputEvent, arr: string[]) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim() && arr.indexOf(value.trim()) == -1) {
      arr.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeElem(index: number, array: string[]) {
    array.splice(index, 1);
  }

  private buildUserRequestData(): UserRequest {
    return {
      userName: this.userForm.get('userName').value,
      academicDegree: this.userForm.get('academicDegree').value,
      positionProfile: this.userForm.get('positionProfile').value,
      summary: this.userForm.get('summary').value,
      industrySectors: this.industrySectorsArray,
      specializations: this.specializationsArray,
      certificates: this.certificatesArray,
      languages: this.languagesArray
    } as UserRequest;
  }

  get industrySectorsArray(): string[] {
    return this.userForm.get('industrySectors').value;
  }

  get specializationsArray(): string[] {
    return this.userForm.get('specializations').value;
  }

  get certificatesArray(): string[] {
    return this.userForm.get('certificates').value;
  }

  get languagesArray(): string[] {
    return this.userForm.get('languages').value;
  }
}
