import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUsersComponent } from './search-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { AnonymousUserSkill } from './anonymous-user-skill';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

@Component({selector: 'app-search-user-form', template: ''})
class SearchUserFormStubComponent {
  @Output() criteriaChangedEvent = new EventEmitter<void>();
  @Output() errorOccurredEvent = new EventEmitter<HttpErrorResponse>();
  @Output() usersFoundEvent = new EventEmitter<AnonymousUserSkill[]>();
}

@Component({selector: 'app-search-user-results', template: ''})
class SearchUserResultsStubComponent {
  @Input() userSkills: AnonymousUserSkill[];
  @Output() errorOccurredEvent = new EventEmitter<HttpErrorResponse>();
}

const anonymousUserSkills: AnonymousUserSkill[] = [
  {
    userReferenceId: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
    skills: [
      {
        skillName: 'Spring',
        currentLevel: 2
      },
      {
        skillName: 'Angular',
        currentLevel: 2
      }
    ]
  },
  {
    userReferenceId: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
    skills: [
      {
        skillName: 'Spring',
        currentLevel: 4
      },
      {
        skillName: 'Angular',
        currentLevel: 3
      }
    ]
  }
];

describe('SearchUsersComponent', () => {
  let component: SearchUsersComponent;
  let fixture: ComponentFixture<SearchUsersComponent>;
  let searchForm;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SearchUsersComponent, SearchUserFormStubComponent, SearchUserResultsStubComponent],
      providers: [
        GlobalErrorHandlerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const searchFormElement = fixture.debugElement.query(By.directive(SearchUserFormStubComponent));
    searchForm = searchFormElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide results on criteriaChangedEvent', () => {
    component.showSearchResult = true;
    searchForm.criteriaChangedEvent.emit();
    fixture.detectChanges();
    expect(component.showSearchResult).toBeFalsy();
  });

  it('should save search result into inner variable', () => {
    searchForm.usersFoundEvent.emit(anonymousUserSkills);
    fixture.detectChanges();
    expect(component.userSkills).toEqual(anonymousUserSkills);
    expect(component.showSearchResult).toBeTruthy();
  });

});
