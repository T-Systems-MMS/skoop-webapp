import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSearchResultComponent } from './user-profile-search-result.component';

describe('UserProfileSearchResultComponent', () => {
  let component: UserProfileSearchResultComponent;
  let fixture: ComponentFixture<UserProfileSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
