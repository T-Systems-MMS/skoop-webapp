import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFilterComponent } from './user-profile-filter.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterValue } from '../filter-value';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { UserProfileSearchResult } from '../user-profile-search-result';

@Component({
  selector: 'app-filter-group',
  template: ''
})
class CheckboxesGroupStubComponent {
  @Input() values: FilterValue[];
  @Input() maxCountToShow = 5;
  @Output() selectionChanged: EventEmitter<void> = new EventEmitter();
}

@Component({
  selector: 'app-user-profile-search-result',
  template: ''
})
class UserProfileSearchResultStubComponent {
  @Input() users: UserProfileSearchResult[];
}

const users: UserProfileSearchResult[] = [
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'tester',
    firstName: 'Toni',
    lastName: 'Tester',
    email: 'toni.tester@skoop.io',
    manager: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'manager',
      firstName: 'Manager',
      lastName: 'Manager',
      email: 'manager.manager@skoop.io'
    },
    certificates: ['cert1'],
    positionProfile: 'Developer',
    skills: [
      {
        skill: {
          id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
          name: 'Angular',
          description: 'JavaScript Framework'
        },
        currentLevel: 2,
        desiredLevel: 3,
        priority: 4
      },
      {
        skill: {
          id: '460d96f3-0deb-4b6c-9653-978a4f5fe76a',
          name: 'Spring Boot',
          description: 'Java Framework'
        },
        currentLevel: 3,
        desiredLevel: 4,
        priority: 2
      }
    ]
  },
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'second',
    firstName: 'second',
    lastName: 'user',
    email: 'toni.tester@skoop.io',
    manager: {
      id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
      userName: 'manager',
      firstName: 'Manager',
      lastName: 'Manager',
      email: 'manager.manager@skoop.io'
    },
    certificates: ['cert1', 'cert2', 'cert3'],
    positionProfile: 'Tester',
    skills: []
  }
];

describe('UserProfileFilterComponent', () => {
  let component: UserProfileFilterComponent;
  let fixture: ComponentFixture<UserProfileFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ UserProfileFilterComponent, CheckboxesGroupStubComponent, UserProfileSearchResultStubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFilterComponent);
    component = fixture.componentInstance;
    component.foundUsers = users;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill in filter arrays', () => {
    expect(component.certificatesFilter)
      .toEqual(['cert1', 'cert2', 'cert3']);
    expect(component.skillsFilter)
      .toEqual(['Angular', 'Spring Boot']);
    expect(component.industrySectorsFilter)
      .toEqual([]);
    expect(component.positionProfilesFilter)
      .toEqual(['Developer', 'Tester']);
  });

  it('should show 2 users when "cert1" selected', () => {
    const selectedFilterValues = [{title: 'cert1', checked: true}];
    component.filterByCertificates(selectedFilterValues);
    expect(component.filteredSearchResult.length).toBe(2);
  });

  it('should show only second user when "cert1" & "cert2" selected', () => {
    const selectedFilterValues = [
      {
        title: 'cert1',
        checked: true
      },
      {
        title: 'cert2',
        checked: true
      }
    ];
    component.filterByCertificates(selectedFilterValues);

    expect(component.filteredSearchResult.length).toBe(1);
    expect(component.filteredSearchResult).toContain(users[1]);
  });

  it('should show only first user when "Angular" selected', () => {
    const selectedFilterValues = [{title: 'Angular', checked: true}];

    component.filterBySkills(selectedFilterValues);
    expect(component.filteredSearchResult.length).toBe(1);
    expect(component.filteredSearchResult).toContain(users[0]);
  });

  it('should not show users when "cert2" & "Angular" selected', () => {
    const selectedCertificatesFilterValues = [{title: 'cert2', checked: true}];
    const selectedSkillsFilterValues = [{title: 'Angular', checked: true}];

    component.filterBySkills(selectedSkillsFilterValues);
    component.filterByCertificates(selectedCertificatesFilterValues);
    expect(component.filteredSearchResult.length).toBe(0);
  });

  it('should show only first user when "Developer" selected', () => {
    const selectedFilterValues = [{title: 'Developer', checked: true}];

    component.filterByPositionProfiles(selectedFilterValues);
    expect(component.filteredSearchResult.length).toBe(1);
    expect(component.filteredSearchResult).toContain(users[0]);
  });
});
