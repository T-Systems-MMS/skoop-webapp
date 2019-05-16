import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDeletedMessageCardComponent } from './community-deleted-message-card.component';

describe('CommunityDeletedMessageCardComponent', () => {
  let component: CommunityDeletedMessageCardComponent;
  let fixture: ComponentFixture<CommunityDeletedMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityDeletedMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityDeletedMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
