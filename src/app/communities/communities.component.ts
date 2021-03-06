import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from './communities.service';
import { combineLatest, Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunitiesNewComponent } from './communities-new.component';
import { CommunitiesEditComponent } from './communities-edit.component';
import { FormControl } from '@angular/forms';
import { CommunityType } from './community-type.enum';
import { CommunityResponse } from './community-response';
import { User } from '../users/user';
import { UserIdentityService } from '../shared/user-identity.service';
import { Community } from './community';
import { InfoDialogComponent } from '../shared/info-dialog/info-dialog.component';
import { CommunityRegistrationService } from '../shared/community-registration.service';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {

  communities$: Observable<CommunityResponse[]> = of([]);
  errorMessage: string = null;
  filter: FormControl = new FormControl('');
  private joinedCommunityIds: string[] = [];
  private managedCommunityIds: string[] = [];
  private currentUserId: string = null;

  constructor(private communityService: CommunitiesService,
              private userIdentityService: UserIdentityService,
              private registrationService: CommunityRegistrationService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadCommunities();
    this.loadUserCommunities();
  }

  openNewDialog(): void {
    this.bottomSheet.open(CommunitiesNewComponent)
      .afterDismissed().subscribe((createdCommunity: CommunityResponse) => {
      if (createdCommunity) {
        this.loadCommunities();
        this.joinedCommunityIds.push(createdCommunity.id);
        this.managedCommunityIds.push(createdCommunity.id);
      }
    });
  }

  openEditDialog(community: CommunityResponse) {
    this.bottomSheet.open(CommunitiesEditComponent, {
      data: <CommunityResponse>{
        id: community.id,
        title: community.title,
        type: community.type || CommunityType.OPEN,
        skills: community.skills,
        description: community.description,
        links: community.links,
        managers: community.managers
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadCommunities());
  }

  joinCommunity(community: CommunityResponse) {
    if (community.type === CommunityType.OPEN) {
      this.joinOpenCommunity(community);
    } else {
      this.joinClosedCommunity(community);
    }
  }

  delete(community: CommunityResponse): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.communityService.deleteCommunity(community.id)
          .subscribe(() => {
            this.loadCommunities();
          }, (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          });
      }
    });
  }

  private loadUserCommunities(): void {
    this.communityService.getUserCommunities().subscribe((userCommunities: CommunityResponse[]) => {
      const joinedCommunityIds: string[] = [];
      userCommunities.forEach(community => joinedCommunityIds.push(community.id));
      this.joinedCommunityIds = joinedCommunityIds;
    }, (errorResponse: HttpErrorResponse) => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private loadCommunities() {
    combineLatest(
      [this.userIdentityService.getUserIdentity(),
      this.communityService.getCommunities()]
    ).subscribe(compoundObject => {
      const userIdentity = compoundObject[0];
      const communities = compoundObject[1];

      this.communities$ = of(communities);
      this.currentUserId = userIdentity.userId;
      const managedCommunityIds: string[] = [];

      communities.forEach((community: CommunityResponse) => {
        if (community.managers) {
          if (community.managers.map((manager: User) => manager.id).indexOf(userIdentity.userId) !== -1) {
            managedCommunityIds.push(community.id);
          }
        }
      });
      this.managedCommunityIds = managedCommunityIds;
    }, (errorResponse: HttpErrorResponse) => {
      this.handleErrorResponse(errorResponse);
    });
  }

  isCommunityJoined(community: Community): boolean {
    return this.joinedCommunityIds.indexOf(community.id) !== -1;
  }

  isCommunityManager(community: Community): boolean {
    return this.managedCommunityIds.indexOf(community.id) !== -1;
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
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
        this.joinedCommunityIds.push(community.id);
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
}
