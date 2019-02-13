import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from './communities.service';
import { Observable, of } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CommunitiesNewComponent } from './communities-new.component';
import { CommunitiesEditComponent } from './communities-edit.component';
import { FormControl } from '@angular/forms';
import { CommunityType } from './community-type.enum';
import { CommunityResponse } from './community-response';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {

  communities$: Observable<CommunityResponse[]> = of([]);
  errorMessage: string = null;
  filter: FormControl = new FormControl('');

  constructor(private communityService: CommunitiesService,
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
        })
      );
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
