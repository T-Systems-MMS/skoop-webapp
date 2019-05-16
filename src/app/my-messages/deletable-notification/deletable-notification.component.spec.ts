import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { DeletableNotificationComponent } from './deletable-notification.component';
import { MatDialog } from '@angular/material';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { NotificationType } from '../notification-type.enum';
import { MessagesService } from '../messages.service';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';

const notification =  {
  type: NotificationType.USER_WELCOME_NOTIFICATION,
  id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
  creationDatetime: new Date()
};

describe('DeletableNotificationComponent', () => {
  let component: DeletableNotificationComponent;
  let fixture: ComponentFixture<DeletableNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ DeletableNotificationComponent, DeleteConfirmationDialogComponent ],
      providers: [
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ DeleteConfirmationDialogComponent ]
        }
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

  it('should open confirmation dialog on delete button click', fakeAsync(() => {
    component.delete(notification);
    fixture.whenStable().then(() => {
      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
    });
  }));
});
