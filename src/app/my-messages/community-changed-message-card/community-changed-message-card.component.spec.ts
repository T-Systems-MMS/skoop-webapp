import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityChangedMessageCardComponent } from './community-changed-message-card.component';

describe('CommunityChangedMessageCardComponent', () => {
  let component: CommunityChangedMessageCardComponent;
  let fixture: ComponentFixture<CommunityChangedMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityChangedMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityChangedMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
