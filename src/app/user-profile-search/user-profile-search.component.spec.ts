import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSearchComponent } from './user-profile-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { By } from '@angular/platform-browser';
import { SPACE } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { UserProfileSearchResult } from './user-profile-search-result';
import { UserProfileSearchService } from './user-profile-search.service';
import { of } from 'rxjs';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';

describe('UserProfileSearchComponent', () => {
  let component: UserProfileSearchComponent;
  let fixture: ComponentFixture<UserProfileSearchComponent>;

  @Component({
    selector: 'app-user-profile-search-result',
    template: ''
  })
  class UserProfileSearchResultStubComponent {
    @Input() foundUsers: UserProfileSearchResult[];
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ UserProfileSearchComponent, UserProfileSearchResultStubComponent ],
      providers: [
        {
          provide: UserProfileSearchService,
          useValue: jasmine.createSpyObj('searchService', {'search': of<UserProfileSearchResult[]>([])})
        },
        GlobalErrorHandlerService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add empty search term (without double quotes) to the term array on space click', () => {
    const initialSize = component.terms.length;
    enterValueAndClickSpace('');

    expect(component.terms.length).toBe(initialSize);
  });

  it('should not add empty search term (with double quotes) to the term array on space click', () => {
    const initialSize = component.terms.length;
    enterValueAndClickSpace('"       "');

    expect(component.terms.length).toBe(initialSize);
  });

  it('should add new search term (without double quotes) to the term array on space click', () => {
    const value = 'JavaScript';
    enterValueAndClickSpace(value);

    expect(component.terms.indexOf(value)).not.toBe(-1);
  });

  it('should add new search term (with double quotes) to the term array on space click', () => {
    const value = '"Java Script"';
    enterValueAndClickSpace(value);

    expect(component.terms.indexOf(value)).not.toBe(-1);
  });

  it('should not add duplicated search term (without double quotes) to the term array on space click', () => {
    enterValueAndClickSpace('JavaScript');
    const initialSize = component.terms.length;

    enterValueAndClickSpace('javascript');
    expect(component.terms.length).toBe(initialSize);
  });

  it('should not add duplicated search term (with double quotes) to the term array on space click', () => {
    enterValueAndClickSpace('"Java Script"');
    const initialSize = component.terms.length;

    enterValueAndClickSpace('"java script"');
    expect(component.terms.length).toBe(initialSize);
  });

  it('should not add search term without second double quote to the term array on space click', () => {
    const initialSize = component.terms.length;
    enterValueAndClickSpace('"Java ');

    expect(component.terms.length).toBe(initialSize);
  });

  it('should remove term from the term array', () => {
    enterValueAndClickSpace('Javascript');
    enterValueAndClickSpace('Java');

    expect(component.terms.length).toBe(2);

    component.remove(0);
    expect(component.terms).toContain('Java');
    expect(component.terms).not.toContain('JavaScript');
  });

  it('should call searchService.search method with expected parameters', () => {
    enterValueAndClickSpace('Javascript');
    enterValueAndClickSpace('Java');

    component.search();

    const searchService: UserProfileSearchService = TestBed.get(UserProfileSearchService);
    expect(searchService.search).toHaveBeenCalledWith(['Javascript', 'Java']);
  });

  function enterValueAndClickSpace(value) {
    const skillDebugElement = fixture.debugElement.query(By.css('#search-input'));
    const inputNativeElement = skillDebugElement.nativeElement;
    const event = new KeyboardEvent('keydown', {
      keyCode: SPACE
    } as KeyboardEventInit);

    inputNativeElement.value = value;
    inputNativeElement.dispatchEvent(event);
  }
});
