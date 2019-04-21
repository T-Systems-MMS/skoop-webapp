import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MembershipService } from './membership.service';
import { MembershipsNewComponent } from './memberships-new.component';
import { MembershipResponse } from './membership-response';

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss']
})
export class MembershipsComponent implements OnInit {

  errorMessage: string = null;

  constructor(private membershipService: MembershipService,
              public dialog: MatDialog,
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
      }
    });
  }

  private loadMemberships() {

  }

}
