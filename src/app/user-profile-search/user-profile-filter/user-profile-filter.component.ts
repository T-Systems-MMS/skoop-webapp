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

  private selectedCertificatesFilterValues: FilterValue[];
  private selectedSkillsFilterValues: FilterValue[];
  private selectedIndustrySectorsFilterValues: FilterValue[];
  private selectedPositionsProfilesFilterValues: FilterValue[];

  constructor() {
  }

  ngOnInit() {
    this.filteredSearchResult = this.foundUsers;

    this.certificatesFilter = this.getCertificatesValues();
    this.skillsFilter = this.getSkillsValues();
    this.industrySectorsFilter = this.getIndustrySectorsValues();
    this.positionProfilesFilter = this.getPositionProfileValues();

    this.selectedCertificatesFilterValues = [];
    this.selectedSkillsFilterValues = [];
    this.selectedIndustrySectorsFilterValues = [];
    this.selectedPositionsProfilesFilterValues = [];
  }

  filterByCertificates(selectedFilterValues: FilterValue[]) {
    this.selectedCertificatesFilterValues = selectedFilterValues;
    this.filter();
  }

  filterBySkills(selectedFilterValues: FilterValue[]) {
    this.selectedSkillsFilterValues = selectedFilterValues;
    this.filter();
  }

  filterByIndustrySectors(selectedFilterValues: FilterValue[]) {
    this.selectedIndustrySectorsFilterValues = selectedFilterValues;
    this.filter();
  }

  filterByPositionProfiles(selectedFilterValues: FilterValue[]) {
    this.selectedPositionsProfilesFilterValues = selectedFilterValues;
    this.filter();
  }

  private filter() {
    this.filteredSearchResult = this.foundUsers.filter(user =>
      this.innerFilterByCertifications(user)
      && this.innerFilterBySkills(user)
      && this.innerFilterByIndustrySectors(user)
      && this.innerFilterByPositionProfile(user)
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

  private innerFilterByCertifications(user: UserProfileSearchResult): boolean {
    if (this.selectedCertificatesFilterValues.length === 0) {
      return true;
    }

    if (!user.certificates || user.certificates.length === 0) {
      return false;
    }

    // if there is some certificate in the filter array which user doesn't have -> filter this user
    return !this.selectedCertificatesFilterValues.some(filterValue => !user.certificates.includes(filterValue.title));
  }

  private innerFilterBySkills(user: UserProfileSearchResult): boolean {
    if (this.selectedSkillsFilterValues.length === 0) {
      return true;
    }

    if (!user.skills || user.skills.length === 0) {
      return false;
    }

    // if there is some skill in the filter array which user doesn't have -> filter this user
    return !this.selectedSkillsFilterValues.some(filterValue => user.skills.find(userSkill => userSkill.skill.name === filterValue.title) == null);
  }

  private innerFilterByIndustrySectors(user: UserProfileSearchResult): boolean {
    if (this.selectedIndustrySectorsFilterValues.length === 0) {
      return true;
    }

    if (!user.industrySectors || user.industrySectors.length === 0) {
      return false;
    }

    // if there is some industry sector in the filter array which user doesn't have -> filter this user
    return !this.selectedIndustrySectorsFilterValues.some(filterValue => !user.industrySectors.includes(filterValue.title));
  }

  private innerFilterByPositionProfile(user: UserProfileSearchResult): boolean {
    if (this.selectedPositionsProfilesFilterValues.length === 0) {
      return true;
    }

    // if there is some positionProfile in the filter array which user doesn't have -> filter this user
    return !this.selectedPositionsProfilesFilterValues.some(filterValue => user.positionProfile !== filterValue.title);
  }

}
