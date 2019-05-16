import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletableNotificationComponent } from './deletable-notification.component';

describe('DeletableNotificationComponent', () => {
  let component: DeletableNotificationComponent;
  let fixture: ComponentFixture<DeletableNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletableNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletableNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
