import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityLeftMessageCardComponent } from './community-left-message-card.component';

describe('CommunityLeftMessageCardComponent', () => {
  let component: CommunityLeftMessageCardComponent;
  let fixture: ComponentFixture<CommunityLeftMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityLeftMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityLeftMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
