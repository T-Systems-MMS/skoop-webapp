import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMessageCardComponent } from './welcome-message-card.component';

describe('WelcomeMessageCardComponent', () => {
  let component: WelcomeMessageCardComponent;
  let fixture: ComponentFixture<WelcomeMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
