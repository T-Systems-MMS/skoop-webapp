import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMessageCardComponent } from './common-message-card.component';

describe('CommonMessageCardComponent', () => {
  let component: CommonMessageCardComponent;
  let fixture: ComponentFixture<CommonMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonMessageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonMessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
