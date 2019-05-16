import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAcceptanceMessageCardComponent } from './community-acceptance-message-card.component';

describe('CommunityAcceptanceMessageCardComponent', () => {
  let component: CommunityAcceptanceMessageCardComponent;
  let fixture: ComponentFixture<CommunityAcceptanceMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityAcceptanceMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAcceptanceMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
