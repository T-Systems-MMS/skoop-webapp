import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunitiesService } from './communities.service';
import { Observable, of } from 'rxjs';
import { Community } from './community';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss']
})
export class CommunitiesComponent implements OnInit {

  communities$: Observable<Community[]> = of([]);
  errorMessage: string = null;

  constructor(private communityService: CommunitiesService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
    this.loadCommunities();
  }

  private loadCommunities() {
    this.communities$ = this.communityService.getCommunities()
      .pipe(
        catchError((err: HttpErrorResponse, caught: Observable<Community[]>) => {
          this.errorMessage = this.globalErrorHandlerService.createFullMessage(err);
          return of([]);
        })
      );
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
