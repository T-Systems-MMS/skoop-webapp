import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonMessageCardComponent } from './common-message-card.component';
import { NotificationType } from '../notification-type.enum';
import { Util } from '../../util/util';

const commonNotification = Util.createNotificationInstance({
  type: NotificationType.USER_WELCOME_NOTIFICATION,
  id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
  creationDatetime: new Date()
});

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
    component.notification = commonNotification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
