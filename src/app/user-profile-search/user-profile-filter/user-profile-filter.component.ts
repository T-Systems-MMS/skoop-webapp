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

  }

  private getCertificatesValues(): FilterValue[] {
    return this.getFilterValuesFor(FilterName.CERTIFICATIONS)
  }

  private getSkillsValues(): FilterValue[] {
    const filterValues: FilterValue[] = [];
    this.foundUsers.forEach(user => {
      user.skills.forEach(value => {
        if (!filterValues.find(filter => filter.title === value.skill.name)) {
          filterValues.push({title: value.skill.name, checked: false});
        }
      });
    });
    return filterValues;
  }

  private getIndustrySectorsValues(): FilterValue[] {
    return this.getFilterValuesFor(FilterName.INDUSTRY_SECTORS)
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
      user[filterName].forEach(value => {
        if (!filterValues.find(filter => filter.title === value)) {
          filterValues.push({title: value, checked: false});
        }
      });
    });
    return filterValues;
  }

}
