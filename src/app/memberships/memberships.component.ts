import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MembershipService } from './membership.service';
import { MembershipsNewComponent } from './memberships-new.component';
import { MembershipResponse } from './membership-response';
import { Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MembershipsEditComponent } from './memberships-edit.component';
import { PopupNotificationService } from '../shared/popup-notification.service';

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss']
})
export class MembershipsComponent implements OnInit {

  errorMessage: string = null;
  memberships$: Observable<MembershipResponse[]> = of([]);

  constructor(private membershipService: MembershipService,
              public dialog: MatDialog,
              private popupNotificationService: PopupNotificationService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheet) {
  }

  ngOnInit() {
    this.loadMemberships();
  }

  openNewDialog() {
    this.bottomSheet.open(MembershipsNewComponent)
      .afterDismissed().subscribe((membership: MembershipResponse) => {
      if (membership) {
        this.loadMemberships();
        this.popupNotificationService.showSuccessMessage('A new membership was created successfully');
      }
    });
  }

  openEditDialog(membership: MembershipResponse) {
    this.bottomSheet.open(MembershipsEditComponent, {
      data: Object.assign({}, membership)
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => {
      this.loadMemberships();
      this.popupNotificationService.showSuccessMessage('The membership was updated successfully');
    });
  }

  delete(membership: MembershipResponse) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.membershipService.deleteMembership(membership.id)
          .subscribe(() => {
            this.loadMemberships();
            this.popupNotificationService.showSuccessMessage('The membership was deleted successfully');
          }, (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          });
      }
    });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  private loadMemberships() {
    this.memberships$ = this.membershipService.getMemberships()
      .pipe(
        catchError((errorResponse: HttpErrorResponse, caught: Observable<MembershipResponse[]>) => {
          this.handleErrorResponse(errorResponse);
          return of([]);
        })
      );
  }

}
