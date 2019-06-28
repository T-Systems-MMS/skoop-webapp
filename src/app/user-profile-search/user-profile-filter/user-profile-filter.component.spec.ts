import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFilterComponent } from './user-profile-filter.component';

describe('UserProfileFilterComponent', () => {
  let component: UserProfileFilterComponent;
  let fixture: ComponentFixture<UserProfileFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
