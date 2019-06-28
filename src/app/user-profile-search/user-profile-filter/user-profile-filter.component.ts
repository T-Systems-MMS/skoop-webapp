import { Component, Input, OnInit } from '@angular/core';
import { UserProfileSearchResult } from '../user-profile-search-result';

@Component({
  selector: 'app-user-profile-filter',
  templateUrl: './user-profile-filter.component.html',
  styleUrls: ['./user-profile-filter.component.scss']
})
export class UserProfileFilterComponent implements OnInit {

  @Input() foundUsers: UserProfileSearchResult[];
  public filteredSearchResult: UserProfileSearchResult[];

  constructor() { }

  ngOnInit() {
    this.filteredSearchResult = this.foundUsers;
  }

  showCertificatesFilter(): boolean {
    return this.existUsersWith('certificates');
  }

  showSkillsFilter(): boolean {
    return this.existUsersWith('skills');
  }

  showIndustrySectorsFilter(): boolean {
    return this.existUsersWith('industrySectors');
  }

  showPositionProfileFilter(): boolean {
    return this.existUsersWith('positionProfile');
  }

  getCertificatesValues(): string[] {
    return this.getFilterValuesFor('certificates')
  }

  getSkillsValues(): string[] {
    const filterValues: string[] = [];
    this.foundUsers.forEach(user => {
      user.skills.forEach(value => {
        if (!filterValues.includes(value.skill.name)) {
          filterValues.push(value.skill.name);
        }
      });
    });
    return filterValues;
  }

  getIndustrySectorsValues(): string[] {
    return this.getFilterValuesFor('industrySectors')
  }

  getPositionProfileValues(): string[] {
    const filterValues: string[] = [];
    this.foundUsers.forEach(user => {
      if (!filterValues.includes(user.positionProfile)) {
        filterValues.push(user.positionProfile);
      }
    });
    return filterValues;
  }


  private existUsersWith(filterName: string): boolean {
    return this.foundUsers.find(item => item[filterName] !== null && item[filterName].length > 0) != null;
  }

  private getFilterValuesFor(filterName: string): string[] {
    const filterValues: string[] = [];
    this.foundUsers.forEach(user => {
      user[filterName].forEach(value => {
        if (!filterValues.includes(value)) {
          filterValues.push(value);
        }
      });
    });
    return filterValues;
  }


}
