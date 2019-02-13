import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from '../communities/communities.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { map } from 'rxjs/operators';
import { CommunityResponse } from '../communities/community-response';

@Component({
  selector: 'app-community-view',
  templateUrl: './community-view.component.html',
  styleUrls: ['./community-view.component.scss']
})
export class CommunityViewComponent implements OnInit {

  community: CommunityResponse;
  errorMessage: string = null;

  constructor(private communityService: CommunitiesService,
              private activatedRoute: ActivatedRoute,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(map(params => params.get('communityId')))
      .subscribe(communityId => {
        this.loadCommunity(communityId);
      });
  }

  private loadCommunity(communityId: string) {
    this.communityService.getCommunity(communityId)
      .subscribe(community => {
        this.community = community;
      }, errorResponse => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }
}
