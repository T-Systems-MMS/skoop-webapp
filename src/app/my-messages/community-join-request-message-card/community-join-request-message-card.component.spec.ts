import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJoinRequestMessageCardComponent } from './community-join-request-message-card.component';

describe('CommunityJoinRequestMessageCardComponent', () => {
  let component: CommunityJoinRequestMessageCardComponent;
  let fixture: ComponentFixture<CommunityJoinRequestMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityJoinRequestMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityJoinRequestMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
