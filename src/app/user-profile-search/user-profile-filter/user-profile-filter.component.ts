import { Component, Input, OnInit } from '@angular/core';
import { UserProfileSearchResult } from '../user-profile-search-result';
import { FilterValue } from '../filter-value';
import { FilterName } from './filter-name.enum';

@Component({
  selector: 'app-user-profile-filter',
  templateUrl: './user-profile-filter.component.html',
  styleUrls: ['./user-profile-filter.component.scss']
})
export class UserProfileFilterComponent implements OnInit {

  @Input() foundUsers: UserProfileSearchResult[];
  public filteredSearchResult: UserProfileSearchResult[];

  public certificatesFilter: FilterValue[];
  public skillsFilter: FilterValue[];
  public industrySectorsFilter: FilterValue[];
  public positionProfilesFilter: FilterValue[];

  constructor() {
  }

  ngOnInit() {
    this.filteredSearchResult = this.foundUsers;

    this.certificatesFilter = this.getCertificatesValues();
    this.skillsFilter = this.getSkillsValues();
    this.industrySectorsFilter = this.getIndustrySectorsValues();
    this.positionProfilesFilter = this.getPositionProfileValues();
  }

  filter() {
    this.filteredSearchResult = this.foundUsers.filter(user =>
      this.filterByCertifications(user)
      && this.filterBySkills(user)
      && this.filterByIndustrySectors(user)
      && this.filterByPositionProfile(user)
    );
  }

  private getCertificatesValues(): FilterValue[] {
    return this.getFilterValuesFor(FilterName.CERTIFICATIONS);
  }

  private getSkillsValues(): FilterValue[] {
    const filterValues: FilterValue[] = [];
    this.foundUsers.forEach(user => {
      if (user.skills) {
        user.skills.forEach(value => {
          if (!filterValues.find(filter => filter.title === value.skill.name)) {
            filterValues.push({title: value.skill.name, checked: false});
          }
        });
      }
    });
    return filterValues;
  }

  private getIndustrySectorsValues(): FilterValue[] {
    return this.getFilterValuesFor(FilterName.INDUSTRY_SECTORS);
  }

  private getPositionProfileValues(): FilterValue[] {
    const filterValues: FilterValue[] = [];
    this.foundUsers.forEach(user => {
      if (!filterValues.find(filter => filter.title === user.positionProfile)) {
        filterValues.push({title: user.positionProfile, checked: false});
      }
    });
    return filterValues;
  }

  private getFilterValuesFor(filterName: string): FilterValue[] {
    const filterValues: FilterValue[] = [];
    this.foundUsers.forEach(user => {
      if (user[filterName]) {
        user[filterName].forEach(value => {
          if (!filterValues.find(filter => filter.title === value)) {
            filterValues.push({title: value, checked: false});
          }
        });
      }
    });
    return filterValues;
  }

  private filterByCertifications(user: UserProfileSearchResult): boolean {
    const filterValues = this.certificatesFilter.filter(item => item.checked);
    if (filterValues.length === 0) {
      return true;
    }

    if (!user.certificates || user.certificates.length === 0) {
      return false;
    }

    // if there is some certificate in the filter array which user doesn't have -> filter this user
    return !filterValues.some(filterValue => !user.certificates.includes(filterValue.title));
  }

  private filterBySkills(user: UserProfileSearchResult): boolean {
    const filterValues = this.skillsFilter.filter(item => item.checked);
    if (filterValues.length === 0) {
      return true;
    }

    if (!user.skills || user.skills.length === 0) {
      return false;
    }

    // if there is some skill in the filter array which user doesn't have -> filter this user
    return !filterValues.some(filterValue => user.skills.find(userSkill => userSkill.skill.name === filterValue.title) == null);
  }

  private filterByIndustrySectors(user: UserProfileSearchResult): boolean {
    const filterValues = this.industrySectorsFilter.filter(item => item.checked);
    if (filterValues.length === 0) {
      return true;
    }

    if (!user.industrySectors || user.industrySectors.length === 0) {
      return false;
    }

    // if there is some industry sector in the filter array which user doesn't have -> filter this user
    return !filterValues.some(filterValue => !user.industrySectors.includes(filterValue.title));
  }

  private filterByPositionProfile(user: UserProfileSearchResult): boolean {
    const filterValues = this.positionProfilesFilter.filter(item => item.checked);
    if (filterValues.length === 0) {
      return true;
    }

    // if there is some positionProfile in the filter array which user doesn't have -> filter this user
    return !filterValues.some(filterValue => user.positionProfile !== filterValue.title);
  }

}
