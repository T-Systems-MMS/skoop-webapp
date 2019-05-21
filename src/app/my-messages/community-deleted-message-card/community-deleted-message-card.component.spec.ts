import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDeletedMessageCardComponent } from './community-deleted-message-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';
import { NotificationType } from '../notification-type.enum';
import { CommunityDeletedNotification } from './community-deleted-notification';

const notification: CommunityDeletedNotification = {
  type: NotificationType.COMMUNITY_DELETED,
  id: '12398802-f12f-47b0-bf8d-6d69aabb77d3',
  creationDatetime: new Date(),
  communityName: 'deleted community'
};

describe('CommunityDeletedMessageCardComponent', () => {
  let component: CommunityDeletedMessageCardComponent;
  let fixture: ComponentFixture<CommunityDeletedMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityDeletedMessageCardComponent, MessageCardComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityDeletedMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = notification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
