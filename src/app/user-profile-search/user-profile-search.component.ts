import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { UserProfileSearchService } from './user-profile-search.service';
import { UserProfileSearchResult } from './user-profile-search-result';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile-search',
  templateUrl: './user-profile-search.component.html',
  styleUrls: ['./user-profile-search.component.scss']
})
export class UserProfileSearchComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [SPACE];
  terms: string[] = [];
  searchResult: UserProfileSearchResult[];
  errorMessage: string = null;

  constructor(private searchService: UserProfileSearchService,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // allow to add space between double quotes
    if (value.startsWith('"') && (value.length === 1  || !value.endsWith('"'))) {
      input.value = value + ' ';
      return;
    }

    // Add term
    if (this.canBeAdded(value)) {
      this.terms.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(index: number): void {
    if (index >= 0) {
      this.terms.splice(index, 1);
    }
  }

  search() {
    this.searchService.search(this.terms)
      .subscribe(data => {
        this.searchResult = data;
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  private canBeAdded(term): boolean {
    const valueLowerCase = (term.startsWith('"') && term.endsWith('"'))
      ? (term.substr(1, term.length - 2) || '').trim().toLowerCase()
      : (term || '').trim().toLowerCase();

    if (!valueLowerCase) {
      return false;
    }

    return this.terms.find(item =>
      (item.startsWith('"') && item.endsWith('"'))
      ? item.substr(1, item.length - 2).toLowerCase() === valueLowerCase
      : item.toLowerCase() === valueLowerCase) == null;
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

}
