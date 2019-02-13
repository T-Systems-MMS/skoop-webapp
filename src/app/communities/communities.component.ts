import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from './communities.service';
import { Observable, of } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunitiesNewComponent } from './communities-new.component';
import { CommunitiesEditComponent } from './communities-edit.component';
import { FormControl } from '@angular/forms';
import { CommunityType } from './community-type.enum';
import { CommunityResponse } from './community-response';
import { User } from '../users/user';
import { UserIdentityService } from '../shared/user-identity.service';
import { UserIdentity } from '../shared/user-identity';
import { Community } from './community';

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

  constructor(private communityService: CommunitiesService,
              private userIdentityService: UserIdentityService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadCommunities();
  }

  openNewDialog(): void {
    this.bottomSheet.open(CommunitiesNewComponent)
      .afterDismissed().subscribe((result) => {
      if (result) {
        this.loadCommunities();
      }
    });
  }

  openEditDialog(community: CommunityResponse) {
    this.bottomSheet.open(CommunitiesEditComponent, {
      data: <CommunityResponse>{
        id: community.id,
        title: community.title,
        type: community.type || CommunityType.OPENED,
        skills: community.skills,
        description: community.description,
        links: community.links,
        managers: community.managers,
        members: community.members
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadCommunities());
  }

  openViewPage(community: CommunityResponse) {

  }

  joinCommunity(community: CommunityResponse) {
    this.communityService.joinCommunity(community.id).subscribe((response: CommunityResponse) => {
      this.joinedCommunityIds.push(response.id);
    }, (errorResponse: HttpErrorResponse) => {
      this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
      // Dirty fix because of: https://github.com/angular/angular/issues/17772
      this.changeDetector.markForCheck();
    });
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
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
    });
  }

  private loadCommunities() {
    this.communities$ = this.communityService.getCommunities()
      .pipe(
        catchError((err: HttpErrorResponse, caught: Observable<CommunityResponse[]>) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(err);
          return of([]);
        }),
        tap((communities: CommunityResponse[]) => {
          const joinedCommunityIds: string[] = [];
          const managedCommunityIds: string[] = [];
          if (communities && communities.length) {
            this.userIdentityService.getUserIdentity()
              .subscribe((userIdentity: UserIdentity) => {
                communities.forEach((community: CommunityResponse) => {
                  if (community.members) {
                    if (community.members.map((member: User) => member.id).indexOf(userIdentity.userId) !== -1) {
                      joinedCommunityIds.push(community.id);
                    }
                  }
                  if (community.managers) {
                    if (community.managers.map((manager: User) => manager.id).indexOf(userIdentity.userId) !== -1) {
                      managedCommunityIds.push(community.id);
                    }
                  }
                });
              }, (errorResponse: HttpErrorResponse) => {
                this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
                // Dirty fix because of: https://github.com/angular/angular/issues/17772
                this.changeDetector.markForCheck();
              });
          }
          this.joinedCommunityIds = joinedCommunityIds;
          this.managedCommunityIds = managedCommunityIds;
        })
      );
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  isCommunityJoined(community: Community): boolean {
    return this.joinedCommunityIds.indexOf(community.id) !== -1;
  }

  isCommunityManager(community: Community): boolean {
    return this.managedCommunityIds.indexOf(community.id) !== -1;
  }

}
