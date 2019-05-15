import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMessageCardComponent } from './community-message-card.component';

describe('CommunityMessageCardComponent', () => {
  let component: CommunityMessageCardComponent;
  let fixture: ComponentFixture<CommunityMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
