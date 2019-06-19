import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from '../communities/communities.service';
import { CommunityResponse } from '../communities/community-response';
import { CommunityType } from '../communities/community-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { InfoDialogComponent } from '../shared/info-dialog/info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunityRegistrationService } from '../shared/community-registration.service';
import { UserIdentityService } from '../shared/user-identity.service';

@Component({
  selector: 'app-recommended-communities',
  templateUrl: './recommended-communities.component.html',
  styleUrls: ['./recommended-communities.component.scss']
})
export class RecommendedCommunitiesComponent implements OnInit {

  communities: CommunityResponse[] = [];
  currentUserId: string = null;
  errorMessage: string = null;

  constructor(private communityService: CommunitiesService,
              private registrationService: CommunityRegistrationService,
              private userIdentityService: UserIdentityService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.communityService.getRecommendedCommunities()
      .subscribe((communities: CommunityResponse[]) => {
        this.communities = communities;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });

    this.userIdentityService.getUserIdentity()
      .subscribe(userIdentity => {
        this.currentUserId = userIdentity.userId;
      }, errorResponse => {
        this.handleErrorResponse(errorResponse);
      });
  }

  joinCommunity(community: CommunityResponse) {
    if (community.type === CommunityType.OPEN) {
      this.joinOpenCommunity(community);
    } else {
      this.joinClosedCommunity(community);
    }
  }

  private showInfoDialog(community: CommunityResponse) {
    this.dialog.open(InfoDialogComponent, {
      width: '350px',
      data: {
        message: `The join request has been successfully sent to the community "${community.title}".`
      }
    });
  }

  private joinOpenCommunity(community: CommunityResponse) {
    this.communityService.joinCommunity(community.id)
      .subscribe(() => {
        // hide community after joining
        this.communities = this.communities.filter( item => item.id !== community.id);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private joinClosedCommunity(community: CommunityResponse) {
    this.registrationService.inviteUsers(community.id, [this.currentUserId])
      .subscribe(() => {
        this.showInfoDialog(community);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
