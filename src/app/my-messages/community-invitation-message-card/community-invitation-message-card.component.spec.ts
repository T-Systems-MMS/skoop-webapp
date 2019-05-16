import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityInvitationMessageCardComponent } from './community-invitation-message-card.component';

describe('CommunityInvitationMessageCardComponent', () => {
  let component: CommunityInvitationMessageCardComponent;
  let fixture: ComponentFixture<CommunityInvitationMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityInvitationMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityInvitationMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
