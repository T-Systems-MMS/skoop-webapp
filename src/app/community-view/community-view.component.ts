import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from '../communities/communities.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { map } from 'rxjs/operators';
import { CommunityResponse } from '../communities/community-response';
import { UserIdentityService } from '../shared/user-identity.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {

  community: CommunityResponse;
  errorMessage: string = null;
  isCommunityMember: boolean;
  isCommunityManager: boolean;

  constructor(private communityService: CommunitiesService,
              private userIdentityService: UserIdentityService,
              private activatedRoute: ActivatedRoute,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('communityId')))
      .subscribe(communityId => {
        this.loadCommunity(communityId);
      });
  }

  joinCommunity() {
    this.communityService.joinCommunity(this.community.id).subscribe((community: CommunityResponse) => {
      this.isCommunityMember = true;
      this.community = community;
    }, (errorResponse: HttpErrorResponse) => {
      this.handleErrorResponse(errorResponse);
    });
  }

  leaveCommunity() {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {
        message: 'Are you sure you want to leave the community?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.communityService.leaveCommunity(this.community.id).subscribe((community: CommunityResponse) => {
          this.isCommunityMember = false;
          this.community = community;
        }, (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        });
      }
    });
  }

  /**
   * User can leave a community when he/she is not the only member or is not the only manager
   */
  canLeaveCommunity() {
    return !this.isCommunityManager && this.isCommunityMember && this.community.members && this.community.members.length > 1
      || this.isCommunityManager && this.community.managers && this.community.managers.length > 1;
  }

  private loadCommunity(communityId: string) {
    this.communityService.getCommunity(communityId)
      .subscribe(community => {
        this.community = community;
        this.detectMembership(community);
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private detectMembership(community: CommunityResponse) {
    this.userIdentityService.getUserIdentity().subscribe(userIdentity => {
      this.isCommunityMember = community.members && community.members.find(item => item.id === userIdentity.userId) != null;
      this.isCommunityManager = community.managers && community.managers.find(item => item.id === userIdentity.userId) != null;
    }, errorResponse => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }
}
