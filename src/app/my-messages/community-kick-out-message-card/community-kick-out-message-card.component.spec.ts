import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityKickOutMessageCardComponent } from './community-kick-out-message-card.component';

describe('CommunityKickOutMessageCardComponent', () => {
  let component: CommunityKickOutMessageCardComponent;
  let fixture: ComponentFixture<CommunityKickOutMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityKickOutMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityKickOutMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
