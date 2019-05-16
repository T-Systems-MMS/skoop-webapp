import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRoleChangedMessageCardComponent } from './community-role-changed-message-card.component';

describe('CommunityRoleChangedMessageCardComponent', () => {
  let component: CommunityRoleChangedMessageCardComponent;
  let fixture: ComponentFixture<CommunityRoleChangedMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityRoleChangedMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRoleChangedMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
