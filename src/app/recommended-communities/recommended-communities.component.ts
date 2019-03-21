import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from '../communities/communities.service';
import { Observable, of } from 'rxjs';
import { CommunityResponse } from '../communities/community-response';
import { CommunityType } from '../communities/community-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { ClosedCommunityInfoDialogComponent } from '../shared/closed-community-info-dialog/closed-community-info-dialog.component';
import { MatDialog } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunityUserResponse } from '../communities/community-user-response';

@Component({
  selector: 'app-recommended-communities',
  templateUrl: './recommended-communities.component.html',
  styleUrls: ['./recommended-communities.component.scss']
})
export class RecommendedCommunitiesComponent implements OnInit {

  communities$: Observable<CommunityResponse[]> = of([]);
  errorMessage: string = null;

  constructor(private communityService: CommunitiesService,
              public dialog: MatDialog,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.communities$ = this.communityService.getRecommendedCommunities();
  }

  joinCommunity(community: CommunityResponse) {
    this.communityService.joinCommunity(community.id).subscribe((communityUserResponse: CommunityUserResponse) => {
      if (community.type === CommunityType.CLOSED) {
        this.showInfoDialog(community);
      }
    }, (errorResponse: HttpErrorResponse) => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private showInfoDialog(community: CommunityResponse) {
    this.dialog.open(ClosedCommunityInfoDialogComponent, {
      width: '350px',
      data: Object.assign({}, community)
    });
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
