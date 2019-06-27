import { Component, Input, OnInit } from '@angular/core';
import { UserProfileSearchResult } from '../user-profile-search-result';

@Component({
  selector: 'app-user-profile-search-result',
  templateUrl: './user-profile-search-result.component.html',
  styleUrls: ['./user-profile-search-result.component.scss']
})
export class UserProfileSearchResultComponent implements OnInit {

  @Input() foundUsers: UserProfileSearchResult[];
  public filteredSearchResult: UserProfileSearchResult[];

  constructor() { }

  ngOnInit() {
    this.filteredSearchResult = this.foundUsers;
  }

}
