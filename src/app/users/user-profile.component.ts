import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from './user';
import { UsersService } from './users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup = null;
  loading = false;
  submitted = false;
  errorMessage: string = null;
  dataAvailable = false;

  constructor(private usersService: UsersService,
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    this.usersService.getUser()
      .subscribe(user => {
        this.userForm = this.formBuilder.group({
          $id: new FormControl(user.id),
          userName: new FormControl(user.userName, [Validators.required, Validators.minLength(3)]),
          firstName: new FormControl(user.firstName),
          lastName: new FormControl(user.lastName),
          email: new FormControl(user.email, [Validators.email]),
          coach: new FormControl(user.coach),
        });
        this.dataAvailable = true;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  onSubmit() {
    this.submitted = true;
    const user: User = this.userForm.value;
    this.usersService.updateUser(user.userName, user.coach)
      .subscribe(() => { },
        (errorResponse: HttpErrorResponse) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
          // Dirty fix because of: https://github.com/angular/angular/issues/17772
          this.changeDetector.markForCheck();
        });
  }
}
