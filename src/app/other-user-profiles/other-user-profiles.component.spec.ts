import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserProfilesComponent } from './other-user-profiles.component';

describe('OtherUserProfilesComponent', () => {
  let component: OtherUserProfilesComponent;
  let fixture: ComponentFixture<OtherUserProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUserProfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
