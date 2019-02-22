import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AnonymousUserSkill } from './anonymous-user-skill';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  userSkills: AnonymousUserSkill[] = [];
  showSearchResult = false;
  errorMessage: string = null;

  constructor(private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) {
  }

  ngOnInit() {
  }

  onCriteriaChanged() {
    this.showSearchResult = false;
  }

  onUsersFound(userSkills: AnonymousUserSkill[]) {
    this.showSearchResult = true;
    this.userSkills = userSkills;
  }

  onError(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
